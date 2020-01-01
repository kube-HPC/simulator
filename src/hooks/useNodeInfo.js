import { useState, useEffect, useMemo, useCallback } from 'react';
import useLogs from './useLogs';
import { nodeFinder } from 'utils';

const EMPTY_NODE = {};

const useNodeInfo = ({ graph, pipeline }) => {
  const [node, setNode] = useState(EMPTY_NODE);
  const { getLogs } = useLogs();
  const findNodeByName = useCallback(nodeFinder({ graph, pipeline }), []);

  useEffect(() => {
    if (pipeline && pipeline.nodes) {
      const [firstNode] = pipeline.nodes;
      const { nodeName } = firstNode;
      const payload = findNodeByName(nodeName);
      setNode(payload);
    }
  }, [findNodeByName, pipeline]);

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
