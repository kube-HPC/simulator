import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { postVersion } from 'actions/dataSources';
import { notification } from 'utils';
import useActiveDataSource from '../../useActiveDataSource';
import VersionSelect from '../VersionSelect';
import useVersions from '../useVersions';
import EditForm from './EditForm';
import ReadOnly from './ReadOnly';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 */

const Body = ({ goTo }) => {
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

  const onSelectVersion = useCallback(() => console.log('not implemented'), []);

  const isEditable = versionsCollection
    ? dataSource.id === _.last(versionsCollection.versions)?.id
    : false;

  return (
    <>
      <VersionSelect
        dataSource={dataSource}
        versionsCollection={versionsCollection}
      />
      {isEditable ? (
        <EditForm
          dataSource={dataSource}
          onCreateVersion={onCreateVersion}
          submittingStatus={versionsCollection.submittingStatus}
        />
      ) : (
        <ReadOnly dataSource={dataSource} onSelectVersion={onSelectVersion} />
      )}
    </>
  );
};

Body.propTypes = {
  goTo: PropTypes.shape({
    edit: PropTypes.func.isRequired,
  }).isRequired,
};

export default Body;
