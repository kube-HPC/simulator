import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DRAWER_SIZE } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import { useDispatch } from 'react-redux';
import { postVersion } from 'actions/dataSources';
import { notification } from 'utils';
import { Alert } from 'antd';
import UploadDragger, { useDragger } from 'components/UploadDragger';
import usePath from './usePath';
import useActiveDataSource from './useActiveDataSource';
import FileBrowser from './FileBrowser';

/**
 * @typedef {import('./FileBrowser').RefContent} RefContent
 * @typedef {import('./stratifier').FlatFile} FlatFile
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 */

/** @type {UploadFile[]} */
const initialState = [];

const EditDrawer = () => {
  const { goTo, dataSourceId } = usePath();
  const { dataSource, isReady, status } = useActiveDataSource();
  const { setOff, isOn } = useToggle(true);

  const [addedFiles, setAddedFiles] = useState(initialState);
  /** @type {{ current?: RefContent }} */
  const fileBrowserRef = useRef();

  const handleFileAdded = useCallback(file => {
    if (!fileBrowserRef.current) return;
    fileBrowserRef.current.addFile(file);
  }, []);

  const handleFileDropped = useCallback(file => {
    fileBrowserRef.current.dropFile(file.uid);
  }, []);

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
          files: addedFiles.map(file => file.originFileObj),
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

  const header = useMemo(() => {
    switch (status) {
      case 'NOT_FOUND':
        return `could not find dataSource id: ${dataSourceId}`;
      case 'SUCCESS':
        return dataSource.name;
      case 'PENDING':
        return 'loading...';
      case 'FAIL':
        return `failed fetching dataSource id: ${dataSourceId}`;
      default:
        return '';
    }
  }, [status, dataSource, dataSourceId]);

  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      width={DRAWER_SIZE.EDIT_DATASOURCE}>
      <h1>{header}</h1>
      <button onClick={onSubmit} type="button">
        submit
      </button>
      <div>
        {isReady ? (
          <>
            <FileBrowser
              files={dataSource.files}
              ref={fileBrowserRef}
              onDelete={handleFileBrowserDelete}
            />
            <UploadDragger
              onChange={onChange}
              fileList={addedFiles}
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
          </>
        ) : null}
      </div>
    </Drawer>
  );
};

export default EditDrawer;
