import { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
/** @typedef {'query' | 'edit'} SideBarMode */

export default () => {
  const { dataSourceId, tabKey, mode, snapshotName } = useParams();
  const history = useHistory();
  const location = useLocation();

  const paths = useMemo(
    () => ({
      root: '/datasources',
      edit: ({ nextDataSourceId = dataSourceId } = {}) =>
        `/datasources/${nextDataSourceId}/edit`,
      query: ({ nextDataSourceId = dataSourceId } = {}) =>
        `/datasources/${nextDataSourceId}/query`,
      snapshot: ({
        nextDataSourceId = dataSourceId,
        nextSnapshotName = snapshotName,
      } = {}) =>
        `/datasources/${nextDataSourceId}/${mode}/snapshot/${nextSnapshotName}`,
    }),
    [dataSourceId, mode, snapshotName]
  );

  const goTo = useMemo(
    () => ({
      root: () =>
        history.push({
          pathname: paths.root,
          search: location.search,
        }),
      edit: ({ nextDataSourceId } = {}) =>
        history.push({
          pathname: paths.edit({ nextDataSourceId }),
          search: location.search,
        }),
      query: ({ nextDataSourceId } = {}) =>
        history.push({
          pathname: paths.query({ nextDataSourceId }),
          search: location.search,
        }),
      snapshot: ({ nextDataSourceId, nextSnapshotName } = {}) =>
        history.push({
          pathname: paths.snapshot({ nextDataSourceId, nextSnapshotName }),
          search: location.search,
        }),
    }),
    [history, paths, location.search]
  );

  return {
    dataSourceId,
    goTo,
    paths,
    tabKey,
    /** @type {SideBarMode} */
    mode,
    snapshotName,
  };
};
