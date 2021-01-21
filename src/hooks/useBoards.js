import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

const generateGetNodeInfo = ({ nodeMap, pipelineName }) => {
  const info = nodeMap[pipelineName];
  return nodeName => (info && info[nodeName]) || { hasMetrics: false };
};

const EMPTY = [];

const useBoards = ({ pipelineName }) => {
  const { nodeMap, taskMap, batchMap } = useSelector(selectors.boards);
  const { boardURL } = useSelector(selectors.connection);

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
