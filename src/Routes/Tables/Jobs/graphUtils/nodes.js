import { nodeKind } from '@hkube/consts';
import { get, pick } from 'lodash';
import GRAPH_TYPES from './../graphUtils/types';

/** @typedef {import('vis').NodeOptions} NodeOptions */
const { STATUS, NODE_GROUPS } = GRAPH_TYPES;

const findNodeByName = (collection = [], name) =>
  collection.find(node => node.nodeName === name);

export const getTaskDetails = node =>
  node?.batch?.length > 0
    ? node?.batch
    : [{ taskId: node?.taskId, podName: node?.podName }];

export const findNode = ({ graph, pipeline }) => nodeName => {
  const nodeData = findNodeByName(graph?.nodes, nodeName);
  const node = findNodeByName(pipeline.nodes, nodeName);
  const { jobId } = pipeline;

  const taskId = nodeData?.taskId ?? get(nodeData, 'batch[0].taskId');
  const podName = nodeData?.podName ?? get(nodeData, 'batch[0].podName');
  const origInput = node?.input ?? [];
  const payload = {
    ...node,
    ...nodeData,
    jobId,
    taskId,
    nodeName,
    podName,
    origInput,
    batch: nodeData?.batch || [],
  };
  return payload;
};

const statusMap = {
  active: {
    availableFrom: new Set([STATUS.STORING, STATUS.ACTIVE]),
    group: NODE_GROUPS.ACTIVE,
  },
  warning: {
    availableFrom: new Set([STATUS.WARNING, STATUS.STALLED]),
    group: NODE_GROUPS.WARNING,
  },
  error: {
    availableFrom: new Set([
      STATUS.CRASHED,
      STATUS.FAILED,
      STATUS.FAILED_SCHEDULING,
    ]),
    group: NODE_GROUPS.ERRORS,
  },
  skipped: {
    availableFrom: new Set([STATUS.SKIPPED]),
    group: NODE_GROUPS.SKIPPED,
  },
  idle: {
    availableFrom: new Set([
      STATUS.PRESCHEDULE,
      STATUS.CREATING,
      STATUS.PENDING,
    ]),
    group: NODE_GROUPS.IDLE,
  },
  succeed: {
    availableFrom: new Set([STATUS.SUCCEED, STATUS.COMPLETED]),
    group: NODE_GROUPS.SUCCEED,
  },
};

const statusToGroup = status =>
  Object.values(statusMap).find(({ availableFrom }) =>
    availableFrom.has(status)
  )?.group ?? NODE_GROUPS.IDLE;

const setNodeGroup = node => {
  const { status } = node;
  return { ...node, group: statusToGroup(status) };
};

const OverrideGroup = collection => (currentGroup, resultedGroup) =>
  collection.has(resultedGroup) ? resultedGroup : currentGroup;

const splitBatchToGroups = (
  { nodeName, algorithmName, batchInfo, level = 0, batch },
  isStreaming
) => {
  const itemsGroups = batch.map(item => item.status).map(statusToGroup);
  const itemsGroupsSet = new Set(itemsGroups);
  const overrideGroup = OverrideGroup(itemsGroupsSet);
  const { completed, total, idle, errors } = batchInfo;

  let group = null;
  if (completed === total) {
    group = NODE_GROUPS.SUCCEED;
  } else if (idle === total) {
    group = NODE_GROUPS.IDLE;
  } else {
    group = NODE_GROUPS.ACTIVE;
  }
  if (errors > 0) {
    group = NODE_GROUPS.ERRORS;
  }

  // the order prioritize the group, lower setting is highest priority
  group = overrideGroup(group, NODE_GROUPS.ACTIVE);
  group = overrideGroup(group, NODE_GROUPS.SKIPPED);
  group = overrideGroup(group, NODE_GROUPS.WARNING);
  group = overrideGroup(group, NODE_GROUPS.ERRORS);

  return {
    nodeName,
    algorithmName,
    extra: {
      batch: isStreaming ? total : `${completed}/${total}`,
    },
    group,
    level,
  };
};

const nodeShapes = {
  default: 'box',
  stateless: 'diamond',
  [nodeKind.Algorithm]: 'box',
  [nodeKind.Debug]: 'hexagon',
  [nodeKind.Gateway]: 'square',
  [nodeKind.DataSource]: 'circle',
};
export const formatNode = (normalizedPipeline, pipelineKind) => node => {
  const isBatch = !!node.batchInfo;
  const isStreaming = pipelineKind === 'stream';
  /** @type {NodeOptions} */
  const meta = isBatch
    ? splitBatchToGroups(node, isStreaming)
    : setNodeGroup(node);

  const pipelineNode = normalizedPipeline[node.nodeName];
  const isStateLess = pipelineNode?.stateType === 'stateless';
  const kind = isStateLess ? 'stateless' : pipelineNode?.kind || 'algorithm';
  const _node = {
    id: meta.nodeName,
    label: meta?.extra?.batch
      ? `${meta.nodeName} (${meta.extra.batch})`
      : `${meta.nodeName} ${node.status === 'FailedScheduling' ? ' (!) ' : ''}`,
  };
  /** @type {NodeOptions} */
  const batchStyling = isBatch
    ? {
        borderWidth: 2,
        shapeProperties: {
          borderDashes: [4, 4],
        },
      }
    : {};
  const editedNode = {
    ...batchStyling,
    ...meta,
    ..._node,
    kind,
    shape: nodeShapes[kind] || nodeShapes.default,
  };
  return pick(
    editedNode,
    'label',
    'shape',
    'extra',
    'borderWidth',
    'id',
    'shapeProperties',
    'group'
  );
};
