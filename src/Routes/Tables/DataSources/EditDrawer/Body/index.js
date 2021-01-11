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

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 */

const Body = ({ goTo, mode }) => {
  const { dataSource } = useActiveDataSource();
  const versionsCollection = useVersions(dataSource);
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
      console.log({ fileIds, id: dataSource.id });
    },
    [dataSource]
  );

  const isEditable = versionsCollection
    ? dataSource.id === _.last(versionsCollection.versions).id
    : false;

  return (
    <>
      <TopPanel
        mode={mode}
        goTo={goTo}
        dataSource={dataSource}
        versionsCollection={versionsCollection}
      />
      <Switch>
        <Route
          exact
          path="/datasources/:dataSourceId/query"
          render={() => (
            <QueryMode dataSource={dataSource} onDownload={onDownload} />
          )}
        />
        <Route
          exact
          path="/datasources/:dataSourceId/edit"
          render={() =>
            isEditable ? (
              <EditMode
                dataSource={dataSource}
                onDownload={onDownload}
                onCreateVersion={onCreateVersion}
                submittingStatus={versionsCollection.submittingStatus}
              />
            ) : (
              <ReadOnly dataSource={dataSource} onDownload={onDownload} />
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
