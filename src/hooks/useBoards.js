import { STATE_SOURCES } from 'const';
import useStore from './useStore';

const useBoards = () => {
  const { nodeMap, taskMap, batchMap } = useStore(STATE_SOURCES.BOARDS);
  return { nodeMap, taskMap, batchMap };
};

export default useBoards;
