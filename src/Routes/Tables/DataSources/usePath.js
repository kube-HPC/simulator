import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
/** @typedef {'query' | 'edit'} SideBarMode */

export default () => {
  const {
    dataSourceId,
    dataSourceName,
    tabKey,
    mode,
    snapshotName,
  } = useParams();

  const history = useHistory();
  const location = useLocation();

  const paths = useMemo(
    () => ({
      root: '/datasources',
      edit: ({
        nextDataSourceId = dataSourceId,
        nextDataSourceName = dataSourceName,
      } = {}) => `/datasources/${nextDataSourceId}/${nextDataSourceName}/edit`,

      query: ({
        nextDataSourceId = dataSourceId,
        nextDataSourceName = dataSourceName,
      } = {}) => `/datasources/${nextDataSourceId}/${nextDataSourceName}/query`,

      snapshot: ({
        nextDataSourceId = dataSourceId,
        nextDataSourceName = dataSourceName,
        nextSnapshotName = snapshotName,
        mode: _mode = mode,
      } = {}) =>
        `/datasources/${nextDataSourceId}/${nextDataSourceName}/${_mode}/snapshot/${nextSnapshotName}`,
    }),
    [dataSourceId, dataSourceName, mode, snapshotName]
  );

  const goTo = useMemo(
    () => ({
      root: () =>
        history.push({
          pathname: paths.root,
          search: location.search,
        }),
      edit: ({ nextDataSourceId, nextDataSourceName } = {}) =>
        history.push({
          pathname: paths.edit({ nextDataSourceId, nextDataSourceName }),
          search: location.search,
        }),
      query: ({ nextDataSourceId, nextDataSourceName } = {}) =>
        history.push({
          pathname: paths.query({ nextDataSourceId, nextDataSourceName }),
          search: location.search,
        }),
      snapshot: ({
        nextDataSourceId,
        nextDataSourceName,
        nextSnapshotName,
        mode: _mode,
      } = {}) =>
        history.push({
          pathname: paths.snapshot({
            nextDataSourceId,
            nextDataSourceName,
            nextSnapshotName,
            mode: _mode,
          }),
          search: location.search,
        }),
    }),
    [history, paths, location.search]
  );

  return {
    dataSourceId,
    dataSourceName,
    goTo,
    paths,
    tabKey,
    /** @type {SideBarMode} */
    mode,
    snapshotName,
  };
};
