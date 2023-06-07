import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { Switch, Route } from 'react-router-dom';
import { postVersion } from 'actions/dataSources';
import DownloadLink from 'components/DownloadLink';
import client from 'client';
import { useActions } from 'hooks';

// import useVersions from 'hooks/dataSources/useVersions';
import { useVersions } from 'hooks/graphql';

import { notification } from 'utils';
// import useActiveDataSource from '../../useActiveDataSource';
import TopPanel from './TopPanel';
import EditMode from './EditMode';
import ReadOnly from './ReadOnly';
import QueryMode from './QueryMode';
import PreviewSnapshot from './PreviewSnapshot';
import useActiveSnapshot from './useActiveSnapshot';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 *
 * @typedef {import('./stratifier').FlatFile} FlatFile
 *
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 *
 * @typedef {import('reducers/dataSources/datasource').DataSource} DataSource
 *
 * @typedef {import('reducers/dataSources/datasource').Snapshot} Snapshot
 *
 * @typedef {DataSource & { snapshot?: Snapshot; isSnapshot: boolean }} ExtendedDataSource
 */

const Body = ({ goTo, mode, dataSource }) => {
  const { versionsCollection, queryData } = useVersions(dataSource);

  const {
    snapshots,
    isReady: hasSnapshots,
    activeSnapshot,
    snapshotName,
  } = useActiveSnapshot({ dataSourceName: dataSource?.name || '' });

  const dispatch = useDispatch();
  const { deleteDataSource } = useActions();
  const handleDelete = useCallback(
    name =>
      deleteDataSource(name, {
        onSuccess: () => {
          notification({ message: `deleted dataSource ${name}`, type: 'info' });
          goTo.root();
        },
      }),
    [deleteDataSource, goTo]
  );
  const [downloadHref, setDownloadHref] = useState(null);
  const onCreateVersion = useCallback(
    ({ files, droppedFileIds, mapping, versionDescription }) => {
      dispatch(
        postVersion(
          {
            dataSourceName: dataSource.name,
            files,
            droppedFileIds,
            mapping,
            versionDescription,
          },
          {
            onSuccess: nextDataSource => {
              if (nextDataSource === 'OK') {
                notification({ message: 'no changes were made', type: 'info' });
              }
              goTo.edit({ nextDataSourceId: nextDataSource.id });
            },
          }
        )
      );
    },
    [dataSource, dispatch, goTo]
  );

  const onDownload = useCallback(
    async fileIds => {
      const {
        data: { href },
      } = await client.post(`/datasource/id/${dataSource.id}/download`, {
        fileIds,
      });
      setDownloadHref(href);
    },
    [dataSource, setDownloadHref]
  );

  const isEditable = versionsCollection
    ? dataSource?.id === _.last(versionsCollection.versions)?.id &&
      !dataSource?.isSnapshot
    : false;

  if (queryData.loading) return 'Loading...';
  if (queryData.error) return `Error! ${queryData.error.message}`;

  return (
    <>
      <TopPanel
        mode={mode}
        goTo={goTo}
        dataSource={dataSource}
        versionsCollection={versionsCollection}
        activeSnapshot={activeSnapshot}
        snapshots={hasSnapshots ? snapshots : []}
      />
      <Switch>
        <Route
          exact
          path="/datasources/:dataSourceId/:dataSourceName/:mode/snapshot/:snapshotName"
          render={() => (
            <PreviewSnapshot
              onDownload={onDownload}
              activeSnapshot={activeSnapshot}
              snapshotName={snapshotName}
            />
          )}
        />
        <Route
          exact
          path="/datasources/:dataSourceId/:dataSourceName/query"
          render={() =>
            dataSource && (
              <QueryMode onDownload={onDownload} dataSource={dataSource} />
            )
          }
        />
        <Route
          exact
          path="/datasources/:dataSourceId/:dataSourceName/edit"
          render={() =>
            isEditable && dataSource ? (
              <EditMode
                onDownload={onDownload}
                onCreateVersion={onCreateVersion}
                dataSource={dataSource}
                onDelete={handleDelete}
                submittingStatus={versionsCollection.submittingStatus}
              />
            ) : (
              dataSource && (
                <ReadOnly onDownload={onDownload} dataSource={dataSource} />
              )
            )
          }
        />
      </Switch>
      <DownloadLink href={downloadHref} unset={setDownloadHref} />
    </>
  );
};

Body.propTypes = {
  goTo: PropTypes.shape({
    edit: PropTypes.func.isRequired,
    root: PropTypes.func.isRequired,
  }).isRequired,
  mode: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isSnapshot: PropTypes.bool,
    name: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
    git: PropTypes.shape({
      kind: PropTypes.string.isRequired,
    }).isRequired,
    storage: PropTypes.shape({
      kind: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Body;
