import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useState } from 'react';
import { nodeFinder } from 'Routes/Tables/Jobs/graph';
import useLogs from './useLogs';
import useSettings from './useSettings';

const EMPTY_NODE = {};

const useNodeInfo = ({ graph, pipeline }) => {
  const [node, setNode] = useState(EMPTY_NODE);
  const { getLogs } = useLogs();
  const { logSource: source, logMode } = useSettings();
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
