import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';

export default () => {
  const { dataSourceId, tabKey, mode } = useParams();
  const history = useHistory();
  const location = useLocation();
  const paths = useMemo(
    () => ({
      root: '/datasources',
      edit: ({ nextDataSourceId = dataSourceId } = {}) =>
        `/datasources/${nextDataSourceId}/edit`,
      query: ({ nextDataSourceId } = {}) =>
        `/datasources/${nextDataSourceId}/query`,
    }),
    [dataSourceId]
  );

  const goTo = useMemo(
    () => ({
      root: () =>
        history.push({ pathname: paths.root, search: location.search }),
      edit: ({ nextDataSourceId } = {}) =>
        history.push({
          pathname: paths.edit({ nextDataSourceId }),
          search: location.search,
        }),
      query: ({ nextDataSourceId, versionId }) =>
        history.push({
          pathname: paths.query({ nextDataSourceId, versionId }),
          search: location.search,
        }),
    }),
    [history, paths, location]
  );

  return {
    dataSourceId,
    goTo,
    paths,
    tabKey,
    mode,
  };
};
