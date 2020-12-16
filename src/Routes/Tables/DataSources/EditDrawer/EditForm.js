import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Alert, Button } from 'antd';
import { postVersion } from 'actions/dataSources';
import { notification } from 'utils';
import UploadDragger, { useDragger } from 'components/UploadDragger';
import FileBrowser from './FileBrowser';
import {
  BottomPanel,
  FileUploadContainer,
  FileBrowserContainer,
} from './styles';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 * @typedef {import('./VersionSelect').DataSource} DataSource
 */

/** @type {UploadFile[]} */
const initialState = [];

/** @param {{ dataSource: DataSource }} props */
const Body = ({ goTo, dataSource }) => {
  const [addedFiles, setAddedFiles] = useState(initialState);
  /** @type {{ current?: RefContent }} */
  const fileBrowserRef = useRef();

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
        <FileBrowserContainer>
          <FileBrowser
            files={dataSource.files}
            ref={fileBrowserRef}
            onDelete={handleFileBrowserDelete}
          />
        </FileBrowserContainer>
        <FileUploadContainer>
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
        </FileUploadContainer>
      </div>
      <BottomPanel>
        <Button htmlType="submit" type="primary" onClick={onSubmit}>
          Update Version
        </Button>
      </BottomPanel>
    </>
  );
};

Body.propTypes = {
  goTo: PropTypes.shape({
    edit: PropTypes.func.isRequired,
  }).isRequired,
  dataSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default Body;
