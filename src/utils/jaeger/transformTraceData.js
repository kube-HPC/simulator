/**
 * IMPORTANT NOTE:
 * taskId extraction is intentionally resilient because Jaeger traces may contain
 * broken or missing parent references.
 *
 * Resolution order per span:
 * 1) Read taskId directly from span tags (taskId / task_id / taskID).
 * 2) If missing, walk up the reference chain (CHILD_OF / FOLLOWS_FROM) and
 *    use the first ancestor that has a taskId tag.
 * 3) If ancestry cannot resolve taskId (for example invalid parent span IDs),
 *    fallback to nearest-in-time span on the same hostname that has taskId.
 */

import _isEqual from 'lodash/isEqual';
import { getTraceSpanIdsAsTree } from './trace';

const TASK_ID_TAG_KEYS = ['taskId', 'task_id', 'taskID'];
const HOST_TAG_KEYS = ['podName', 'pod_name', 'pod', 'hostname'];

const getTagValue = (tags, keys) => {
  if (!Array.isArray(tags)) {
    return '';
  }

  const tag = tags.find(item => keys.includes(item.key));
  return tag?.value ? String(tag.value) : '';
};

const getDirectParentSpanId = span => {
  if (!Array.isArray(span?.references) || span.references.length === 0) {
    return '';
  }

  const parentRef = span.references.find(
    ref => ref?.refType === 'CHILD_OF' || ref?.refType === 'FOLLOWS_FROM'
  );
  return parentRef?.spanID || '';
};

export default function transformTraceData(data, algorithms) {
  let { traceID } = data;
  if (!traceID) {
    return null;
  }
  traceID = traceID.toLowerCase();

  let traceEndTime = 0;
  let traceStartTime = Number.MAX_SAFE_INTEGER;
  const spanIdCounts = new Map();
  const spanMap = new Map();
  const allInputSpans = Array.isArray(data.spans) ? data.spans : [];
  const allInputProcesses = data.processes || {};
  const allInputProcessesById = new Map(Object.entries(allInputProcesses));
  const allInputSpansById = new Map(
    allInputSpans.map(span => [span.spanID, span])
  );
  const allInputParentBySpanId = new Map(
    allInputSpans.map(span => [span.spanID, getDirectParentSpanId(span)])
  );
  const allInputSpanDetailsById = new Map(
    allInputSpans.map(span => {
      const process = allInputProcessesById.get(span.processID);
      const hostname =
        getTagValue(span.tags, HOST_TAG_KEYS) ||
        getTagValue(process?.tags, HOST_TAG_KEYS);

      return [
        span.spanID,
        {
          spanID: span.spanID,
          startTime: span.startTime || 0,
          taskId: getTagValue(span.tags, TASK_ID_TAG_KEYS),
          hostname,
        },
      ];
    })
  );
  const taskCandidatesByHostname = allInputSpans.reduce((acc, span) => {
    const details = allInputSpanDetailsById.get(span.spanID);
    if (!details?.hostname || !details.taskId) {
      return acc;
    }

    if (!acc.has(details.hostname)) {
      acc.set(details.hostname, []);
    }
    acc.get(details.hostname).push(details);
    return acc;
  }, new Map());

  const getNearestTaskIdByHostname = ({ spanID, startTime, hostname }) => {
    if (!hostname) {
      return '';
    }

    const candidates = taskCandidatesByHostname.get(hostname);
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return '';
    }

    let nearestTaskId = '';
    let minDistance = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      if (candidate.spanID !== spanID) {
        const distance = Math.abs(
          (candidate.startTime || 0) - (startTime || 0)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestTaskId = candidate.taskId;
        }
      }
    }

    return nearestTaskId;
  };

  const resolvedTaskIdsBySpanId = new Map();
  // Strategy: direct taskId on the span -> walk ancestry -> nearest same-host span.
  const resolveTaskIdForSpan = spanId => {
    if (!spanId) {
      return '';
    }
    if (resolvedTaskIdsBySpanId.has(spanId)) {
      return resolvedTaskIdsBySpanId.get(spanId);
    }

    const visited = new Set();
    let currentSpanId = spanId;
    let taskId = '';

    while (currentSpanId && !visited.has(currentSpanId)) {
      visited.add(currentSpanId);
      const currentSpan = allInputSpansById.get(currentSpanId);
      if (!currentSpan) {
        break;
      }

      taskId = getTagValue(currentSpan.tags, TASK_ID_TAG_KEYS);
      if (taskId) {
        break;
      }

      currentSpanId = allInputParentBySpanId.get(currentSpanId);
    }

    if (!taskId) {
      const details = allInputSpanDetailsById.get(spanId);
      taskId = getNearestTaskIdByHostname(details || {});
    }

    resolvedTaskIdsBySpanId.set(spanId, taskId || '');
    return taskId || '';
  };
  const allSpanTaskIdsBySpanID = new Map(
    allInputSpans.map(span => [span.spanID, resolveTaskIdForSpan(span.spanID)])
  );

  // Keep only processes whose serviceName appears in the pipeline algorithms list.
  // eslint-disable-next-line no-param-reassign
  data.processes = Object.keys(data.processes)
    .filter(k => algorithms.includes(data.processes[k].serviceName))
    .reduce((acc, cur) => {
      acc[cur] = data.processes[cur];
      return acc;
    }, {});

  const processKeys = Object.keys(data.processes);

  // Keep spans that have a startTime and belong to one of the kept processes.
  // eslint-disable-next-line no-param-reassign
  data.spans = data.spans.filter(
    span => Boolean(span.startTime) && processKeys.includes(span.processID)
  );

  const max = data.spans.length;
  if (!max) {
    return null;
  }
  // Attach process objects and enforce unique span IDs to avoid collisions in maps/tree.
  for (let i = 0; i < max; i++) {
    const span = data.spans[i];
    const { startTime, duration, processID } = span;
    //
    let { spanID } = span;
    // check for start / end time for the trace
    if (startTime < traceStartTime) {
      traceStartTime = startTime;
    }
    if (startTime + duration > traceEndTime) {
      traceEndTime = startTime + duration;
    }
    // make sure span IDs are unique
    const idCount = spanIdCounts.get(spanID);
    if (idCount != null) {
      console.warn(
        `Dupe spanID, ${idCount + 1} x ${spanID}`,
        span,
        spanMap.get(spanID)
      );
      if (_isEqual(span, spanMap.get(spanID))) {
        console.warn('\t two spans with same ID have `isEqual(...) === true`');
      }
      spanIdCounts.set(spanID, idCount + 1);
      const existingTaskId = allSpanTaskIdsBySpanID.get(spanID) || '';
      spanID = `${spanID}_${idCount}`;
      span.spanID = spanID;
      allSpanTaskIdsBySpanID.set(spanID, existingTaskId);
    } else {
      spanIdCounts.set(spanID, 1);
    }
    span.process = data.processes[processID];
    spanMap.set(spanID, span);
  }
  // tree is necessary to sort the spans, so children follow parents, and
  // siblings are sorted by start time
  const tree = getTraceSpanIdsAsTree(data);
  const spans = [];

  tree.walk((spanID, node, depth) => {
    if (spanID === '__root__') {
      return;
    }
    const span = spanMap.get(spanID);
    if (!span) {
      return;
    }
    spans.push({
      relativeStartTime: span.startTime - traceStartTime,
      depth: depth - 1,
      hasChildren: node.children.length > 0,
      // spread fails with union types
      duration: span.duration,
      logs: span.logs,
      operationName: span.operationName,
      process: span.process,
      processID: span.processID,
      references: span.references,
      spanID: span.spanID,
      startTime: span.startTime,
      taskId: allSpanTaskIdsBySpanID.get(span.spanID) || '',
      tags: span.tags,
      traceID: span.traceID,
    });
  });
  return {
    spans,
    traceID,
    // can't use spread operator for intersection types
    // repl: https://goo.gl/4Z23MJ
    // issue: https://github.com/facebook/flow/issues/1511
    processes: data.processes,
    duration: traceEndTime - traceStartTime,
    startTime: traceStartTime,
    endTime: traceEndTime,
  };
}
