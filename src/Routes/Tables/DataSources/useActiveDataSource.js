import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import usePath from './usePath';

const useActiveDataSource = () => {
  const { dataSourceId } = usePath();
  const dataSource = useSelector(state => {
    return selectors.dataSources.byId(state, dataSourceId);
  });
  const status = useSelector(selectors.dataSources.status);
  // add use effect to fetch more data (some datasources are meta data only, also fetching updates)

  return { dataSource, status, isReady: status === 'SUCCESS' && dataSource };
};

export default useActiveDataSource;
