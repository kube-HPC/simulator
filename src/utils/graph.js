import { GRAPH_TYPES } from 'const';

const { STATUS, BATCH } = GRAPH_TYPES;

const sameStatus = [STATUS.SKIPPED, STATUS.FAILED];
const completedStatus = [STATUS.SUCCEED];
const notStartedStatus = [STATUS.CREATING, STATUS.PENDING];

export const findNodeName = nodeName => node => node.nodeName === nodeName;

export const getTaskDetails = node =>
  node && node.batch && node.batch.length > 0
    ? node.batch
    : [{ taskId: node.taskId, podName: node.podName }];

export const nodeFinder = ({ graph, pipeline }) => nodeName => {
  const nodeData =
    graph && graph.nodes ? graph.nodes.find(findNodeName(nodeName)) : [];
  const node = pipeline.nodes.find(findNodeName(nodeName));
  const { jobId } = pipeline;

  const taskId =
    nodeData && nodeData.taskId
      ? nodeData.taskId
      : nodeData.batch && nodeData.batch[0].taskId;
  const podName =
    nodeData && nodeData.podName
      ? nodeData.podName
      : nodeData.batch && nodeData.batch[0].podName;
  const origInput = node ? node.input : [];
  const payload = {
    ...nodeData,
    jobId,
    taskId,
    nodeName,
    podName,
    origInput,
    batch: nodeData.batch || [],
  };

  return payload;
};

const toStatus = status =>
  completedStatus.includes(status)
    ? STATUS.COMPLETED
    : notStartedStatus.includes(status)
    ? STATUS.NOT_STARTED
    : sameStatus.includes(status)
    ? status
    : STATUS.RUNNING;

const handleSingle = node => ({ ...node, group: toStatus(node.status) });

const handleBatch = ({ nodeName, algorithmName, batchInfo, level = 0 }) => {
  const { completed, total, idle, running, errors } = batchInfo;
  let _completed = 0;
  let group = null;
  if (completed === total) {
    _completed = total;
    group = BATCH.COMPLETED;
  } else if (idle === total) {
    _completed = 0;
    group = BATCH.NOT_STARTED;
  } else {
    _completed = running + completed;
    group = BATCH.RUNNING;
  }
  if (errors > 0) {
    group = BATCH.ERRORS;
  }
  return {
    nodeName,
    algorithmName,
    extra: {
      batch: `${_completed}/${total}`,
    },
    group,
    level,
  };
};

const handleNode = n => (!n.batchInfo ? handleSingle(n) : handleBatch(n));

const createScale = (from, to) => {
  const scale = (to[1] - to[0]) / (from[1] - from[0]);
  return scale;
}

const fromScale = [0, 100];
const toScale = [2, 5];
const fixedScale = createScale(fromScale, toScale);

const scaleValue = (value, from, to, scale) => {
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return (toScale[0] + toScale[1]) - (capped * scale + to[0]);
}

export const formatNode = n => {
  const fn = handleNode(n);
  const node = {
    id: fn.nodeName,
    label:
      fn.extra && fn.extra.batch
        ? `${fn.nodeName}-${fn.extra.batch}`
        : fn.nodeName,
  };
  return { ...fn, ...node };
};

export const formatEdge = e => {
  const { edges, throughput, ...rest } = e;
  const [group] = edges;
  const edge = {
    id: `${e.from}->${e.to}`,
    dashes: group === 'waitAny' || group === 'AlgorithmExecution',
  };
  let edgeProps;
  if (throughput) {
    const label = `${throughput}%`; // for debugging...
    const width = scaleValue(throughput, fromScale, toScale, fixedScale);
    const edgeColor = throughput > 0 && throughput < 50
      ? 'red' : throughput > 50 && throughput < 80
      ? 'yellow'
      : 'green'
    const color = { color: edgeColor };
    edgeProps = { label, width, color }
  }
  return { ...rest, ...edge, ...edgeProps, group };
};
