import { useState } from 'react';
import useActions from './useActions';

const DEFAULT_NODE = {};

const findNodeName = nodeName => node => node.nodeName === nodeName;

const useNodeInfo = ({ graph, pipeline }) => {
  const [node, setNode] = useState(DEFAULT_NODE);
  const { getKubernetesLogsData: getLogs } = useActions();

  const events = {
    click: ({ nodes }) => {
      const [nodeName] = nodes;
      if (!nodeName) {
        return;
      }

      const nodeData = graph.nodes.find(findNodeName(nodeName));
      const node = pipeline.nodes.find(findNodeName(nodeName));
      const jobId = pipeline.jobId;
      const taskId =
        nodeData && nodeData.taskId ? nodeData.taskId : nodeData.batch && nodeData.batch[0].taskId;
      const podName =
        nodeData && nodeData.podName
          ? nodeData.podName
          : nodeData.batch && nodeData.batch[0].podName;

      getLogs({ taskId, podName });

      const payload = {
        ...nodeData,
        jobId,
        taskId,
        nodeName,
        podName,
        origInput: node.input,
        batch: nodeData.batch || [],
      };

      setNode(payload);
    },
  };

  return { node, events };
};

export default useNodeInfo;
