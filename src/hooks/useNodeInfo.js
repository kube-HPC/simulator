import { useEffect, useMemo, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { findNode } from 'Routes/Tables/Jobs/graphUtils';
// import { useLazyLogs } from 'hooks/graphql';
import useSettings from './useSettings';

const EMPTY_NODE = {};

const useNodeInfo = ({ graph, pipeline }) => {
  const [node, setNode] = useState(EMPTY_NODE);
  const [reloadNodeData, setReloadNodeData] = useState('');

  const { logSource: source, logMode } = useSettings();
  const findNodeByName = findNode({ graph, pipeline });

  // Update logs on first entry
  useEffect(() => {
    if (graph?.nodes) {
      const [firstNode] = graph.nodes;
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
        setNode(newNode);
      }
    }
  }, [findNodeByName, graph, node, source, logMode]);

  useEffect(() => {
    if (reloadNodeData) {
      const payload = findNodeByName(reloadNodeData);
      setNode(payload);
    }
  }, [reloadNodeData]);

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

  return { node, setReloadNodeData, reloadNodeData, events };
};

export default useNodeInfo;
