import { STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';

const useStats = () => {
  const {
    dataSource: [cpu, memory],
  } = useSelector(state => state[STATE_SOURCES.NODE_STATISTICS]);

  return { cpu, memory };
};

export default useStats;
