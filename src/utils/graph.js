import { GRAPH_TYPES } from 'const';
import { nodeKind } from '@hkube/consts';

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
    ...node,
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
    extra: { batch: `${_completed}/${total}` },
    group,
    level,
  };
};

const createFixedScale = (from, to) => (to[1] - to[0]) / (from[1] - from[0]);

const createCappedScale = (from, to) => {
  const scale = createFixedScale(from, to);
  return value => {
    const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return to[0] + to[1] - (capped * scale + to[0]);
  };
};

const fromScale = [0, 100];
const toScale = [2, 5];
const scaleThroughput = createCappedScale(fromScale, toScale);

const nodeShapes = {
  default: 'box',
  algorithm: 'box',
  [nodeKind.DataSource]: 'circle',
};

const _titleFormat = (metrics) => {
  const title = Object.entries(metrics).map(([k, v]) => `${k}: ${v}`).join('<br>');
  return title;
};

export const formatNode = normalizedPipeline => node => {
  const meta = node.batchInfo ? handleBatch(node) : handleSingle(node);
  const kind = normalizedPipeline[node.nodeName].kind || 'algorithm';
  const _node = {
    id: meta.nodeName,
    label:
      meta.extra && meta.extra.batch
        ? `${meta.nodeName}-${meta.extra.batch}`
        : meta.nodeName,
  };
  return {
    ...meta,
    ..._node,
    kind,
    shape: nodeShapes[kind] || nodeShapes.default,
  };
};

export const formatEdge = edge => {
  const { value, ...rest } = edge;
  const [group] = (value && value.types) || [];
  const { metrics } = value || {};
  const _edge = {
    id: `${edge.from}->${edge.to}`,
    dashes: group === 'waitAny' || group === 'AlgorithmExecution',
  };
  let styles;
  if (metrics) {
    const { throughput } = metrics;
    const title = _titleFormat(metrics);
    const label = `${throughput}%`; // for debugging...
    const width = scaleThroughput(throughput);
    const edgeColor =
      throughput > 0 && throughput < 50
        ? 'red'
        : throughput > 50 && throughput < 80
          ? 'yellow'
          : 'green';
    const color = { color: edgeColor };
    styles = { title, label, width, color };
  }
  return { ...rest, ..._edge, ...styles, group };
};
