import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { Switch, Route } from 'react-router-dom';
import { postVersion } from 'actions/dataSources';
import { notification } from 'utils';
import useActiveDataSource from '../../useActiveDataSource';
import TopPanel from './TopPanel';
import useVersions from '../useVersions';
import EditMode from './EditMode';
import ReadOnly from './ReadOnly';
import QueryMode from './QueryMode';
import PreviewSnapshot from './PreviewSnapshot';
import useSnapshots from '../useSnapshots';
/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 * @typedef {import('reducers/dataSources/datasource').DataSource} DataSource
 * @typedef {import('reducers/dataSources/datasource').Snapshot} Snapshot
 * @typedef {DataSource & { snapshot?: Snapshot; isSnapshot: boolean }} ExtendedDataSource
 */

const Body = ({ goTo, mode }) => {
  const { dataSource } = useActiveDataSource();
  const versionsCollection = useVersions(dataSource);
  const {
    collection: snapshots,
    isReady: hasSnapshots,
    activeSnapshot,
  } = useSnapshots({ dataSourceName: dataSource.name });
  const dispatch = useDispatch();

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
    fileIds => {
      // eslint-disable-next-line
      console.log({ fileIds, id: dataSource.id });
    },
    [dataSource]
  );

  const isEditable = versionsCollection
    ? dataSource.id === _.last(versionsCollection.versions).id &&
      !dataSource.isSnapshot
    : false;

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
          path="/datasources/:dataSourceId/:mode/snapshot/:snapshotName"
          render={() => (
            <PreviewSnapshot
              onDownload={onDownload}
              activeSnapshot={activeSnapshot}
            />
          )}
        />
        <Route
          exact
          path="/datasources/:dataSourceId/query"
          render={() => (
            <QueryMode onDownload={onDownload} dataSource={dataSource} />
          )}
        />
        <Route
          exact
          path="/datasources/:dataSourceId/edit"
          render={() =>
            isEditable ? (
              <EditMode
                onDownload={onDownload}
                onCreateVersion={onCreateVersion}
                dataSource={dataSource}
                submittingStatus={versionsCollection.submittingStatus}
              />
            ) : (
              <ReadOnly onDownload={onDownload} dataSource={dataSource} />
            )
          }
        />
      </Switch>
    </>
  );
};

Body.propTypes = {
  goTo: PropTypes.shape({
    edit: PropTypes.func.isRequired,
  }).isRequired,
  mode: PropTypes.string.isRequired,
};

export default Body;
