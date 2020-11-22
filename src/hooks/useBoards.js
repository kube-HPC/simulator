import { STATE_SOURCES } from 'const';
import { useCallback, useMemo } from 'react';
import useStore from './useStore';

const generateGetNodeInfo = ({ nodeMap, pipelineName }) => {
  const info = nodeMap[pipelineName];
  return nodeName => (info && info[nodeName]) || { hasMetrics: false };
};

const EMPTY = [];

const useBoards = ({ pipelineName }) => {
  const { nodeMap, taskMap, batchMap } = useStore(STATE_SOURCES.BOARDS);
  const boardURL = useStore(STATE_SOURCES.BOARD_URL);

  const getNodeInfo = useMemo(
    () => generateGetNodeInfo({ nodeMap, pipelineName }),
    [nodeMap, pipelineName]
  );
  const pipelineInfo = nodeMap && nodeMap[pipelineName];

  const nodesWithBoards =
    (pipelineInfo &&
      Object.entries(pipelineInfo).filter(([, info]) => info.id)) ||
    EMPTY;

  const boards = useMemo(
    () => nodesWithBoards.map(([name, info]) => ({ name, ...info })),
    [nodesWithBoards]
  );

  const hasMetrics = useCallback(nodeName => getNodeInfo(nodeName).hasMetrics, [
    getNodeInfo,
  ]);

  return {
    taskMap,
    batchMap,
    boardURL,
    boards,
    hasMetrics,
    pipelineInfo,
  };
};

export default useBoards;
