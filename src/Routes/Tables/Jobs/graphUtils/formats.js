import { nodeKind } from '@hkube/consts';
import { COLOR } from 'styles/colors';
import GRAPH_TYPES from './../graphUtils/types';

/** @typedef {import('vis').NodeOptions} NodeOptions */

const { STATUS, BATCH } = GRAPH_TYPES;

const sameStatus = [STATUS.SKIPPED, STATUS.FAILED];
const completedStatus = [STATUS.SUCCEED];
const notStartedStatus = [STATUS.CREATING, STATUS.PENDING];

const findNodeByName = (collection = [], name) =>
  collection.find(node => node.nodeName === name);

export const getTaskDetails = node =>
  node?.batch?.length > 0
    ? node.batch
    : [{ taskId: node.taskId, podName: node.podName }];

export const findNode = ({ graph, pipeline }) => nodeName => {
  const nodeData = findNodeByName(graph?.nodes, nodeName);
  const node = findNodeByName(pipeline?.nodes, nodeName);
  const { jobId } = pipeline;
  const taskId = nodeData?.taskId ?? nodeData?.batch[0]?.taskId;
  const podName = nodeData?.podName ?? nodeData?.batch[0]?.podName;
  const origInput = node?.input ?? [];
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

const setNodeGroup = node => {
  const { status } = node;
  const group = completedStatus.includes(status)
    ? STATUS.COMPLETED
    : notStartedStatus.includes(status)
    ? STATUS.NOT_STARTED
    : sameStatus.includes(status)
    ? status
    : STATUS.RUNNING;
  return { ...node, group };
};

const splitBatchToGroups = ({
  nodeName,
  algorithmName,
  batchInfo,
  level = 0,
}) => {
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

const FixedScale = (from, to) => (to[1] - to[0]) / (from[1] - from[0]);

const CappedScale = (from, to) => {
  const scale = FixedScale(from, to);
  return value => {
    const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return to[0] + to[1] - (capped * scale + to[0]);
  };
};

const fromScale = [0, 100];
const toScale = [1, 6];
const scaleThroughput = CappedScale(fromScale, toScale);

const nodeShapes = {
  default: 'box',
  algorithm: 'box',
  stateless: 'diamond',
  [nodeKind.DataSource]: 'circle',
};

const _formatTitle = metrics =>
  Object.entries(metrics)
    .map(([k, v]) => `${k}: ${v}`)
    .join('<br>');

export const formatNode = normalizedPipeline => node => {
  const meta = node.batchInfo ? splitBatchToGroups(node) : setNodeGroup(node);
  const pipelineNode = normalizedPipeline[node.nodeName];
  const isStateLess = pipelineNode.stateType === 'stateless';
  const kind = isStateLess ? 'stateless' : pipelineNode.kind || 'algorithm';
  const _node = {
    id: meta.nodeName,
    label: meta?.extra?.batch
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
  let styles = {};
  if (metrics) {
    const { throughput } = metrics;
    const title = _formatTitle(metrics);
    const label = `${throughput}%`; // for debugging...
    const width = scaleThroughput(throughput);
    const edgeColor =
      throughput > 0 && throughput < 50
        ? COLOR.redPale
        : throughput > 50 && throughput < 80
        ? COLOR.blueLight
        : COLOR.greenLight;
    const color = { color: edgeColor };
    styles = {
      title,
      label,
      width,
      color,
    };
  }
  return { ...rest, ..._edge, ...styles, group };
};
