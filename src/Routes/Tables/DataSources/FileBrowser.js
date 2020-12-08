import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import {
  ChonkyActions,
  FileBrowser as ChonkyFileBrowser,
  FileContextMenu,
  FileHelper,
  FileList,
  FileNavbar,
  FileToolbar,
  setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import useFileMap from './useFileMap';

/**
 * @typedef {import('chonky').ChonkyFileActionData} ChonkyFileActionData
 * @typedef {import('chonky').FileArray} FileArray
 * @typedef {import('chonky').FileData} FileData
 * @typedef {FileData & {
 *   parentId?: string;
 *   childrenIds?: string[];
 * }} CustomFileData
 * @typedef {{ [fileId: string]: CustomFileData }} CustomFileMap
 */

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const fileActions = [ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles];

const FileBrowser = ({ files: srcFiles, forwardRef }) => {
  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
    retrieveFiles,
    touchedFiles,
    deletedFiles,
  } = useFileMap(srcFiles);

  const [isFlat, toggleFlat] = useReducer(state => !state, false);

  const files = useMemo(() => {
    if (isFlat) {
      return Object.values(fileMap).filter(file => !file.isDir);
    }
    const currentFolder = fileMap[currentFolderId];
    return currentFolder.childrenIds
      ? currentFolder.childrenIds.map(
          /** @param {string} fileId */
          fileId => fileMap[fileId] ?? null
        )
      : [];
  }, [currentFolderId, fileMap, isFlat]);

  const folderChain = useMemo(() => {
    const getParent = folder =>
      !folder.parentId
        ? [folder]
        : [...getParent(fileMap[folder.parentId]), folder];

    return getParent(fileMap[currentFolderId]);
  }, [currentFolderId, fileMap]);

  const handleFileAction = useCallback(
    /** @param {ChonkyFileActionData} action */
    action => {
      switch (action.id) {
        case ChonkyActions.DeleteFiles.id:
          return deleteFiles(action.state.selectedFilesForAction);
        case ChonkyActions.MoveFiles.id:
          // eslint-disable-next-line
          const { payload } = action;
          return moveFiles(payload.files, payload.source, payload.destination);
        case ChonkyActions.OpenFiles.id:
          // eslint-disable-next-line
          const { targetFile, files } = action.payload;
          // eslint-disable-next-line
          const fileToOpen = targetFile ?? files[0];
          if (fileToOpen && FileHelper.isDirectory(fileToOpen))
            setCurrentFolderId(fileToOpen.id);
          else {
            console.log({ fileToOpen });
          }
          return null;
        case ChonkyActions.CreateFolder.id:
          // eslint-disable-next-line
          const folderName = prompt('Enter a name for your new folder:');
          if (folderName) createFolder(folderName);
          return null;
        default:
          return null;
      }
    },
    [createFolder, deleteFiles, moveFiles, setCurrentFolderId]
  );

  useImperativeHandle(forwardRef, () => ({
    ls: retrieveFiles,
    getDeleteFiles: () => deletedFiles,
    getCWD: () =>
      folderChain.length === 1
        ? '/'
        : folderChain
            .map(item => item.name)
            .join('/')
            .slice(1),
  }));

  return (
    <>
      <button type="button" onClick={resetFileMap} style={{ marginBottom: 10 }}>
        Reset file map
      </button>
      <button type="button" onClick={toggleFlat}>
        toggle flat
      </button>
      <div style={{ height: 400 }}>
        <ChonkyFileBrowser
          files={files}
          folderChain={folderChain}
          fileActions={fileActions}
          onFileAction={handleFileAction}>
          <FileNavbar />
          <FileToolbar />
          <FileList />
          <FileContextMenu />
        </ChonkyFileBrowser>
        <pre>{JSON.stringify(deletedFiles, null, 2)}</pre>
        <pre>{JSON.stringify(touchedFiles, null, 2)}</pre>
        <pre>{JSON.stringify(files, null, 2)}</pre>
        <pre>{JSON.stringify(retrieveFiles(), null, 2)}</pre>
      </div>
    </>
  );
};

const WrappedFileBrowser = React.forwardRef((props, ref) => (
  // eslint-disable-next-line
  <FileBrowser {...props} forwardRef={ref} />
));

FileBrowser.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      isDir: PropTypes.bool,
    })
  ),
  forwardRef: PropTypes.shape({
    // eslint-disable-next-line
    currentFolder: PropTypes.object,
  }).isRequired,
};
FileBrowser.defaultProps = {
  files: [],
};

export default WrappedFileBrowser;
