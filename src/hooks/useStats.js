import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

const useStats = () => {
  const [cpu, memory, gpu] = useSelector(selectors.nodeStatistics);
  return { cpu, memory, gpu };
};

export default useStats;
