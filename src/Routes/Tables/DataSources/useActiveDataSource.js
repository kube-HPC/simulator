import { useSelector } from 'react-redux';
import { selectors } from 'reducers/dataSources';
import usePath from './usePath';

const useActiveDataSource = () => {
  const { dataSourceId, goTo } = usePath();
  const dataSource = useSelector(state => {
    return selectors.byId(state.dataSources, dataSourceId);
  });
  const status = useSelector(state => selectors.status(state.dataSources));
  // add use effect to fetch more data (some datasources are meta data only, also fetching updates)
  if (status === 'SUCCESS' && !dataSource) goTo.root();

  return { dataSource, status, isReady: status === 'SUCCESS' && dataSource };
};

export default useActiveDataSource;
