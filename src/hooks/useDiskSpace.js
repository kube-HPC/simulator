import { STATE_SOURCES } from 'const';
import { useSelector } from 'react-redux';

const useDiskSpace = () => {
  const { dataSource } = useSelector(state => state[STATE_SOURCES.DISK_SPACE]);
  return { diskSpace: dataSource };
};

export default useDiskSpace;
