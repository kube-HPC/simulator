import { STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';

const useStats = () => {
  const {
    dataSource: [cpu, memory, gpu],
  } = useSelector(state => state[STATE_SOURCES.NODE_STATISTICS]);

  return { cpu, memory, gpu };
};

export default useStats;
