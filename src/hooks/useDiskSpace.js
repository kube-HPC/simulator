import { STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';

const useDiskSpace = () => {
  const diskSpace = useSelector(state => state[STATE_SOURCES.DISK_SPACE]);
  return { dataSource: diskSpace };
};

export default useDiskSpace;
