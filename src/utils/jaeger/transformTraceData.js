import _isEqual from 'lodash/isEqual';
import { getTraceSpanIdsAsTree } from './trace';

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

  // eslint-disable-next-line no-param-reassign
  data.processes = Object.keys(data.processes)
    .filter((k) => algorithms.includes(data.processes[k].serviceName))
    .reduce((acc, cur) => {
      acc[cur] = data.processes[cur];
      return acc;
    }, {});

  const processKeys = Object.keys(data.processes);

  // filter out spans with empty start times and processes ids
  // eslint-disable-next-line no-param-reassign
  data.spans = data.spans.filter(span => Boolean(span.startTime) && processKeys.includes(span.processID));

  const max = data.spans.length;
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
      spanID = `${spanID}_${idCount}`;
      span.spanID = spanID;
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
