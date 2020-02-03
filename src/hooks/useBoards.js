import { STATE_SOURCES } from 'const';
import useStore from './useStore';

const generateGetNodeInfo = ({ nodeMap, pipelineName }) => {
  const info = nodeMap[pipelineName];
  return nodeName => (info && info[nodeName]) || { hasMetrics: false };
};

const EMPTY = [];

const useBoards = ({ pipelineName }) => {
  const { nodeMap, taskMap, batchMap } = useStore(STATE_SOURCES.BOARDS);

  const getNodeInfo = generateGetNodeInfo({ nodeMap, pipelineName });
  const pipelineInfo = nodeMap && nodeMap[pipelineName];

  const nodesWithBoards =
    (pipelineInfo && Object.entries(pipelineInfo).filter(([, info]) => info.id)) || EMPTY;

  const boards = nodesWithBoards.map(([name, { boardLink, status }]) => ({
    name,
    boardLink,
    status,
  }));

  return {
    taskMap,
    batchMap,
    boards,
    hasMetrics: nodeName => getNodeInfo(nodeName).hasMetrics,
    pipelineInfo,
  };
};

export default useBoards;
