import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { fetchDataSourceVersions } from 'actions/dataSources';

export default dataSource => {
  const dispatch = useDispatch();

  const versionsCollection = useSelector(state =>
    selectors.dataSources.versions(state, dataSource.name)
  );
  useEffect(() => {
    if (!dataSource) return;
    if (versionsCollection.status === 'IDLE') {
      dispatch(fetchDataSourceVersions(dataSource));
    }
  }, [dispatch, versionsCollection, dataSource]);
  return versionsCollection;
};
