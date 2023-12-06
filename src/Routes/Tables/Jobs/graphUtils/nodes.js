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

  const groupValue =
    status === STATUS.FAILED_SCHEDULING && node?.warnings?.length > 0
      ? NODE_GROUPS.WARNING
      : statusToGroup(status);
  return { ...node, group: groupValue };
};

const OverrideGroup = collection => (currentGroup, resultedGroup) =>
  collection.has(resultedGroup) ? resultedGroup : currentGroup;

const splitBatchToGroups = (
  { nodeName, algorithmName, batchInfo, level = 0, batch, warnings },
  isStreaming
) => {
  const itemsGroups = batch.map(item => item.status).map(statusToGroup);
  const itemsGroupsSet = new Set(itemsGroups);
  const overrideGroup = OverrideGroup(itemsGroupsSet);
  const { completed, total, idle, errors, running } = batchInfo;

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

  if (warnings?.length > 0) {
    group = NODE_GROUPS.WARNING;
  }

  return {
    nodeName,
    algorithmName,
    extra: {
      batch: isStreaming
        ? `${running}/${total}` // total
        : `${completed}/${total}`,
    },
    group,
    level,
  };
};

const nodeShapes = {
  default: 'box',
  stateless: 'box', // diamond',
  [nodeKind.Algorithm]: 'box',
  [nodeKind.Debug]: 'hexagon',
  [nodeKind.Gateway]: 'square',
  [nodeKind.DataSource]: 'circle',
};
export const formatNode = (
  normalizedPipeline,
  pipelineKind,
  position
) => node => {
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
    title: `${meta.nodeName} ${
      pipelineNode?.stateType ? pipelineNode.stateType : ''
    }`,
    x: (position && position?.nodesPostions[node.nodeName]?.x) || 0,
    y: (position && position?.nodesPostions[node.nodeName]?.y) || 0,
    label: meta?.extra?.batch
      ? `${meta.nodeName} (${meta.extra.batch})`
      : `${meta.nodeName} `,
  };
  /** @type {NodeOptions} */
  const batchStyling = isBatch
    ? {
        borderWidth: 1,
        shapeProperties: {
          borderDashes: [0, 0],
        },
      }
    : {};

  const batchStateLessStyling =
    isBatch && isStateLess
      ? {
          shadow: {
            enabled: true,
            color: 'rgba(69,169, 236, 1)',
            size: 1,
            x: 7,
            y: 7,
          },
        }
      : {};

  const editedNode = {
    ...batchStateLessStyling,
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
    'title',
    'shapeProperties',
    'group',
    'x',
    'y',
    'shadow'
  );
};
