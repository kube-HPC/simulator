import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Alert, Button } from 'antd';
import _ from 'lodash';
import { postVersion } from 'actions/dataSources';
import { notification } from 'utils';
import UploadDragger, { useDragger } from 'components/UploadDragger';
import FileBrowser from './FileBrowser';
import { BottomPanel, FileUploadContainer } from './styles';
import useActiveDataSource from './../useActiveDataSource';
import VersionSelect from './VersionSelect';
import useVersions from './useVersions';
/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 */

/** @type {UploadFile[]} */
const initialState = [];

const Body = ({ goTo }) => {
  const { dataSource } = useActiveDataSource();
  const [addedFiles, setAddedFiles] = useState(initialState);
  /** @type {{ current?: RefContent }} */
  const fileBrowserRef = useRef();
  const versionsCollection = useVersions(dataSource);
  const isEditable = versionsCollection
    ? dataSource.id === _.last(versionsCollection.versions)?.id
    : false;

  const handleFileAdded = useCallback(
    file => {
      /* eslint-disable consistent-return, no-alert */
      if (!fileBrowserRef.current) return;
      const existingFile = fileBrowserRef.current
        .getCurrentDirContent()
        .find(item => item.name === file.name);

      if (
        !existingFile ||
        window.confirm(
          `file ${file.name} already exists would you like to override it?`
        )
      )
        return fileBrowserRef.current.addFile(file);
      setAddedFiles(current => current.filter(item => item.uid !== file.uid));
      /* eslint-enable consistent-return, no-alert */
    },
    [fileBrowserRef]
  );

  const handleFileDropped = useCallback(
    file => {
      fileBrowserRef.current.dropFile(file.uid);
    },
    [fileBrowserRef]
  );

  const handleFileBrowserDelete = useCallback(
    /** @param {FlatFile[]} files */
    files => {
      const fileIds = new Set(files.map(file => file.id));
      return setAddedFiles(state =>
        state.filter(file => !fileIds.has(file.uid))
      );
    },
    [setAddedFiles]
  );

  const { onChange, customRequest } = useDragger({
    onAddFile: handleFileAdded,
    onDropFile: handleFileDropped,
    setFileList: setAddedFiles,
  });

  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    if (!fileBrowserRef.current) return;
    dispatch(
      postVersion(
        {
          dataSourceName: dataSource.name,
          files: addedFiles,
          droppedFileIds: fileBrowserRef.current.getDeleteFiles(),
          mapping: fileBrowserRef.current.ls(),
          versionDescription: 'new version from the ui',
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
  }, [fileBrowserRef, dataSource, dispatch, goTo, addedFiles]);

  useEffect(() => {
    setAddedFiles([]);
  }, [dataSource.id]);

  return (
    <>
      <div>
        <VersionSelect
          dataSource={dataSource}
          versionsCollection={versionsCollection}
        />
        <FileBrowser
          isReadOnly={!isEditable}
          files={dataSource.files}
          ref={fileBrowserRef}
          onDelete={handleFileBrowserDelete}
        />
        <FileUploadContainer>
          {isEditable ? (
            <UploadDragger
              onChange={onChange}
              fileList={[]}
              customRequest={customRequest}>
              <Alert
                message={
                  addedFiles.length
                    ? addedFiles.length === 1
                      ? '1 file to upload'
                      : `${addedFiles.length} files to upload`
                    : 'please select at least one file to upload'
                }
                type={addedFiles.length ? 'info' : 'warning'}
                showIcon
              />
            </UploadDragger>
          ) : null}
        </FileUploadContainer>
      </div>
      <BottomPanel>
        {isEditable ? (
          <Button type="primary" onClick={onSubmit}>
            Update Version
          </Button>
        ) : (
          <Button type="primary" onClick={() => console.log('not implemented')}>
            Select Version
          </Button>
        )}
      </BottomPanel>
    </>
  );
};

Body.propTypes = {
  goTo: PropTypes.shape({
    edit: PropTypes.func.isRequired,
  }).isRequired,
};

export default Body;
