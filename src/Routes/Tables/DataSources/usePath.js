import { useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
/** @typedef {'query' | 'edit'} SideBarMode */

export default () => {
  const {
    dataSourceId,
    dataSourceName,
    tabKey,
    mode,
    snapshotName,
  } = useParams();

  const navigate = useNavigate();
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
        navigate({
          pathname: paths.root,
          search: location.search,
        }),
      edit: ({ nextDataSourceId, nextDataSourceName } = {}) =>
        navigate({
          pathname: paths.edit({ nextDataSourceId, nextDataSourceName }),
          search: location.search,
        }),
      query: ({ nextDataSourceId, nextDataSourceName } = {}) =>
        navigate({
          pathname: paths.query({ nextDataSourceId, nextDataSourceName }),
          search: location.search,
        }),
      snapshot: ({
        nextDataSourceId,
        nextDataSourceName,
        nextSnapshotName,
        mode: _mode,
      } = {}) =>
        navigate({
          pathname: paths.snapshot({
            nextDataSourceId,
            nextDataSourceName,
            nextSnapshotName,
            mode: _mode,
          }),
          search: location.search,
        }),
    }),
    [navigate, paths, location.search]
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
