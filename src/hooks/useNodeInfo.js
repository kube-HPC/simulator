import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useState } from 'react';
import { nodeFinder } from 'utils';
import useLogs from './useLogs';

const EMPTY_NODE = {};

const useNodeInfo = ({ graph, pipeline }) => {
  const [node, setNode] = useState(EMPTY_NODE);
  const { getLogs } = useLogs();
  const findNodeByName = nodeFinder({ graph, pipeline });

  // Update logs on first entry
  useEffect(() => {
    if (pipeline && pipeline.nodes) {
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
        getLogs({ taskId, podName });
        setNode(newNode);
      }
    }
  }, [findNodeByName, getLogs, graph, node]);

  const events = useMemo(
    () => ({
      click: ({ nodes }) => {
        const [nodeName] = nodes;
        if (!nodeName) {
          return;
        }

        const payload = findNodeByName(nodeName);
        const { taskId, podName } = payload;

        getLogs({ taskId, podName });
        setNode(payload);
      },
    }),
    [getLogs, findNodeByName],
  );

  return { node, events };
};

export default useNodeInfo;
