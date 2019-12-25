import { useState, useEffect } from 'react';
import useActions from './useActions';

const EMPTY_NODE = {};

const findNodeName = nodeName => node => node.nodeName === nodeName;

const nodeFinder = ({ graph, pipeline }) => nodeName => {
  const nodeData = graph.nodes.find(findNodeName(nodeName));
  const node = pipeline.nodes.find(findNodeName(nodeName));
  const { jobId } = pipeline;

  const taskId =
    nodeData && nodeData.taskId ? nodeData.taskId : nodeData.batch && nodeData.batch[0].taskId;
  const podName =
    nodeData && nodeData.podName ? nodeData.podName : nodeData.batch && nodeData.batch[0].podName;

  const payload = {
    ...nodeData,
    jobId,
    taskId,
    nodeName,
    podName,
    origInput: node.input,
    batch: nodeData.batch || [],
  };

  return payload;
};

const useNodeInfo = ({ graph, pipeline }) => {
  const [node, setNode] = useState(EMPTY_NODE);
  const { getKubernetesLogsData: getLogs } = useActions();
  const findNodeByName = nodeFinder({ graph, pipeline });

  useEffect(() => {
    if (pipeline && pipeline.nodes) {
      const [firstNode] = pipeline.nodes;
      const { nodeName } = firstNode;
      const payload = findNodeByName(nodeName);
      setNode(payload);
    }
  }, []);

  const events = {
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
  };

  return { node, events };
};

export default useNodeInfo;
