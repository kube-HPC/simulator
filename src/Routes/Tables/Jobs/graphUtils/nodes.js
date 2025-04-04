import { nodeKind, taskStatuses as TASK } from '@hkube/consts';
import { get, pick } from 'lodash';
import { COLOR_TASK_STATUS } from 'styles/colors';
import { lightenColor } from 'utils/stringHelper';
import GRAPH_TYPES from './../graphUtils/types';
import { groups } from './../graphUtils/styles';

/** @typedef {import('vis').NodeOptions} NodeOptions */
const { STATUS, NODE_GROUPS } = GRAPH_TYPES;

const hasHashOrAtSymbol = input => {
  if (Array.isArray(input)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of input) {
      if (typeof item === 'string' && item.startsWith('#')) {
        return true;
      }
    }
  }
  return false; // Return false if no matching item is found
};

const findNodeByName = (name, collection = []) =>
  collection.find(node => node.nodeName === name);

export const getTaskDetails = node =>
  node?.batch?.length > 0
    ? node?.batch
    : [{ taskId: node?.taskId, podName: node?.podName, status: node.status }];

export const findNode =
  ({ graph, pipeline }) =>
  nodeName => {
    const nodeData = findNodeByName(nodeName, graph?.nodes);
    const node = findNodeByName(nodeName, pipeline.nodes);
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
  stopped: {
    availableFrom: new Set([STATUS.STOPPED]),
    group: NODE_GROUPS.STOPPED,
  },
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
  { nodeName, status, algorithmName, batchInfo, level = 0, batch, warnings },
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
  group = overrideGroup(group, NODE_GROUPS.SKIPPED);
  group = overrideGroup(group, NODE_GROUPS.WARNING);
  group = overrideGroup(group, NODE_GROUPS.STOPPED);
  group = overrideGroup(group, NODE_GROUPS.ACTIVE);
  group = overrideGroup(group, NODE_GROUPS.ERRORS);

  if (warnings?.length > 0) {
    group = NODE_GROUPS.WARNING;
  }

  // secondary Status (view on border node)

  let secondaryStatus = NODE_GROUPS.ACTIVE;
  if (group === NODE_GROUPS.ACTIVE) {
    secondaryStatus = overrideGroup(secondaryStatus, NODE_GROUPS.SUCCEED);
    secondaryStatus =
      status === STATUS.FAILED_SCHEDULING
        ? STATUS.FAILED_SCHEDULING
        : secondaryStatus;
    secondaryStatus = overrideGroup(secondaryStatus, NODE_GROUPS.STOPPED);
    secondaryStatus = overrideGroup(secondaryStatus, NODE_GROUPS.WARNING);
    secondaryStatus = overrideGroup(secondaryStatus, NODE_GROUPS.ERRORS);
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
    secondaryStatus,
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

const groupsColor = {
  succeed: COLOR_TASK_STATUS[TASK.COMPLETED],
  batchSucceed: COLOR_TASK_STATUS[TASK.COMPLETED],
  batchIdle: COLOR_TASK_STATUS[TASK.PENDING],
  batchErrors: COLOR_TASK_STATUS[TASK.FAILED],
  batchActive: COLOR_TASK_STATUS[TASK.ACTIVE],
  batchWarning: COLOR_TASK_STATUS[TASK.WARNING],
  batchSkipped: COLOR_TASK_STATUS[TASK.SKIPPED],
  batchStopped: COLOR_TASK_STATUS[TASK.STOPPED],
};

export const formatNode =
  (normalizedPipeline, pipelineKind, position) => node => {
    const isStreaming = pipelineKind === 'stream';
    const pipelineNode = normalizedPipeline[node.nodeName];
    const isStateLess = pipelineNode?.stateType === 'stateless';
    const kind = isStateLess ? 'stateless' : pipelineNode?.kind || 'algorithm';

    const isBatch = !!node.batchInfo;
    const isBatchStyling =
      (isStreaming && isStateLess) ||
      (!isStreaming && hasHashOrAtSymbol(pipelineNode?.input));

    /** @type {NodeOptions} */

    const meta = isBatch
      ? splitBatchToGroups(node, isStreaming)
      : setNodeGroup(node);

    const _node = {
      id: meta.nodeName,
      title: `${meta.nodeName} ${pipelineNode?.stateType ? pipelineNode.stateType : ''} ${node?.devMode ? '(dev)' : ''}`,
      x: (position && position?.nodesPostions[node.nodeName]?.x) || 0,
      y: (position && position?.nodesPostions[node.nodeName]?.y) || 0,
      font: { multi: true },
      label: `${
        meta?.extra?.batch
          ? `${meta.nodeName} (${meta.extra.batch})`
          : `${meta.nodeName}`
      } ${node?.devMode ? '<b><i>(dev)</i></b>' : ''}`,
    };
    /** @type {NodeOptions} */
    const batchStyling = isBatchStyling
      ? {
          borderWidth: 1,
          shapeProperties: {
            borderDashes: [0, 0],
          },
          shadow: {
            enabled: true,
            color: lightenColor(
              groupsColor[meta.group] || COLOR_TASK_STATUS[TASK.SKIPPED],
              meta.group === 'batchIdle' ? 0 : 40
            ),
            size: 1,
            x: 5,
            y: 5,
          },
        }
      : {};

    const groupSettings =
      isStateLess && meta.secondaryStatus !== NODE_GROUPS.ACTIVE
        ? {
            ...groups[meta.group].color,
            border: groupsColor[meta.secondaryStatus],
            borderWidth: 2,
          } || {}
        : { ...groups[meta.group].color };

    const editedNode = {
      ...batchStyling,
      ...meta,
      ..._node,
      kind,
      shape:
        nodeShapes[pipelineNode?.kind || 'algorithm'] || nodeShapes.default,
      color: {
        ...groupSettings,
      },
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
      'shadow',
      'font',
      'color'
    );
  };
