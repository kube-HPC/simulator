import { useEffect, useMemo, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { findNode } from 'Routes/Tables/Jobs/graphUtils';
import useSettings from './useSettings';

import useLogs from './useLogs';

// import  useLazeLogs  from './graphql/useLazeLogs';

const EMPTY_NODE = {};

const useNodeInfo = ({ graph, pipeline }) => {
  const [node, setNode] = useState(EMPTY_NODE);
  /*
  export const getKubernetesLogsData = ({
    podName,
    taskId,
    source = 'k8s',
    nodeKind,
    logMode,
  }) => ({
    type: actions.REST_REQ_GET,
    payload: {
      url: `logs?${qs.stringify(
        filterEmptyValues({ podName, taskId, source, nodeKind, logMode })
      )}`,
      actionType: actions.JOBS_KUBERNETES_LOGS,
    },
  }); */

  const { getLogs } = useLogs();
  // const { getLogs } = useLazeLogs();
  const { logSource: source, logMode } = useSettings();
  const findNodeByName = findNode({ graph, pipeline });

  // Update logs on first entry
  useEffect(() => {
    if (pipeline?.nodes) {
      const [firstNode] = pipeline.nodes;
      const { nodeName } = firstNode;
      const newNode = findNodeByName(nodeName);

      if (node === EMPTY_NODE) {
        setNode(newNode);
      }
    }
  }, [findNodeByName, graph, node, pipeline]);

  // Update each tick
  useEffect(() => {
    if (node !== EMPTY_NODE) {
      const { nodeName } = node;
      const newNode = findNodeByName(nodeName);
      if (!isEqual(node, newNode)) {
        const { taskId, podName } = newNode;
        getLogs({ taskId, podName, source, logMode });

        setNode(newNode);
      }
    }
  }, [findNodeByName, getLogs, graph, node, source, logMode]);

  const events = useMemo(
    () => ({
      click: ({ nodes }) => {
        const [nodeName] = nodes;
        if (!nodeName) {
          return;
        }

        const payload = findNodeByName(nodeName);
        setNode(payload);
      },
    }),
    [findNodeByName]
  );

  return { node, events };
};

export default useNodeInfo;
