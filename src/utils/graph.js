import { GRAPH_TYPES } from 'const';

const { STATUS, BATCH } = GRAPH_TYPES;

const sameStatus = [STATUS.SKIPPED, STATUS.FAILED];
const completedStatus = [STATUS.SUCCEED];
const notStartedStatus = [STATUS.CREATING, STATUS.PENDING];

export const findNodeName = nodeName => node => node.nodeName === nodeName;

export const nodeFinder = ({ graph, pipeline }) => nodeName => {
  const nodeData = graph.nodes.find(findNodeName(nodeName));
  const node = pipeline.nodes.find(findNodeName(nodeName));
  const { jobId } = pipeline;

  const taskId =
    nodeData && nodeData.taskId ? nodeData.taskId : nodeData.batch && nodeData.batch[0].taskId;
  const podName =
    nodeData && nodeData.podName ? nodeData.podName : nodeData.batch && nodeData.batch[0].podName;

  const payload = {
    ...nodeData,
    jobId,
    taskId,
    nodeName,
    podName,
    origInput: node.input,
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

const handleBatch = ({ nodeName, algorithmName, batchInfo, level }) => {
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

export const formatNode = n => {
  const fn = handleNode(n);
  const node = {
    id: fn.nodeName,
    label: fn.extra && fn.extra.batch ? `${fn.nodeName}-${fn.extra.batch}` : fn.nodeName,
  };
  return { ...fn, ...node };
};

export const formatEdge = e => {
  const { edges, ...rest } = e;
  const [group] = edges;
  const edge = {
    id: `${e.from}->${e.to}`,
    dashes: group === 'waitAny' || group === 'AlgorithmExecution',
  };
  return { ...rest, ...edge, group };
};
