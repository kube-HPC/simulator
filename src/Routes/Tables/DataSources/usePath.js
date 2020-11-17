import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';

export default () => {
  const { dataSourceId, tabKey } = useParams();
  const history = useHistory();
  const location = useLocation();
  const paths = useMemo(
    () => ({
      root: '/datasources',
      edit: ({ nextDataSourceId = dataSourceId } = {}) =>
        `/datasources/${nextDataSourceId}/edit`,
    }),
    [dataSourceId]
  );

  const goTo = useMemo(
    () => ({
      root: () =>
        history.push({ pathname: paths.root, search: location.search }),
      edit: ({ nextDataSourceId = dataSourceId } = {}) =>
        history.push({
          pathname: paths.edit({ nextDataSourceId }),
          search: location.search,
        }),
    }),
    [history, paths, dataSourceId, location]
  );

  return {
    dataSourceId,
    goTo,
    paths,
    tabKey,
  };
};
