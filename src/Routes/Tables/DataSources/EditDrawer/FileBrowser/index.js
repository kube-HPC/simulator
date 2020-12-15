import React, {
  useCallback,
  useEffect,
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
import DebugWindow from 'components/DebugWindow';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import useFileMap from './useFileMap';

/**
 * @typedef {import('chonky').ChonkyFileActionData} ChonkyFileActionData
 * @typedef {import('chonky').FileArray} FileArray
 * @typedef {import('chonky').FileData} FileData
 * @typedef {import('antd/lib/upload/interface').UploadFile}
 * @typedef {import('./stratifier').StratifiedDirectory} StratifiedDirectory
 * @typedef {import('./stratifier').StratifiedFile} StratifiedFile
 * @typedef {FileData & {
 *   parentId?: string;
 *   childrenIds?: string[];
 * }} CustomFileData
 * @typedef {{
 *   [fileId: string]: CustomFileData;
 * }} CustomFileMap
 * @typedef {{
 *   ls: () => FileArray;
 *   getDeleteFiles: () => string[];
 *   getCWD: () => string;
 *   addFile: (file: UploadFile, folderId?: string) => void;
 *   dropFile: (id: string) => void;
 *   resetFileMap: () => void;
 *   toggleFlat: () => void;
 *   getCurrentDirContent: (StratifiedDirectory | StratifiedFile)[];
 * }} RefContent
 */

setChonkyDefaults({ iconComponent: ChonkyIconFA });

const fileActions = [ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles];

const FileBrowser = ({ files: srcFiles, forwardRef, onDelete }) => {
  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
    addFile,
    retrieveFiles,
    touchedFiles,
    deletedFiles,
  } = useFileMap(srcFiles);

  useEffect(() => {
    if (Array.isArray(srcFiles)) resetFileMap(srcFiles);
  }, [resetFileMap, srcFiles]);

  const [isFlat, toggleFlat] = useReducer(state => !state, false);

  const files = useMemo(() => {
    if (isFlat) {
      return Object.values(fileMap).filter(file => !file.isDir);
    }
    /** @type {StratifiedDirectory} */
    const currentFolder = fileMap[currentFolderId];
    if (!currentFolder || !currentFolder.childrenIds) return [];
    return currentFolder.childrenIds
      .map(fileId => fileMap[fileId] ?? null)
      .filter(file => !file.isHidden);
  }, [currentFolderId, fileMap, isFlat]);

  const folderChain = useMemo(() => {
    const getParent = folder =>
      !folder?.parentId
        ? [folder]
        : [...getParent(fileMap[folder.parentId]), folder];

    return getParent(fileMap[currentFolderId]);
  }, [currentFolderId, fileMap]);

  const handleFileAction = useCallback(
    /** @param {ChonkyFileActionData} action */
    action => {
      switch (action.id) {
        case ChonkyActions.DeleteFiles.id:
          onDelete && onDelete(action.state.selectedFilesForAction);
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
            // console.log({ fileToOpen });
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
    [createFolder, deleteFiles, moveFiles, setCurrentFolderId, onDelete]
  );

  const getCWD = () =>
    folderChain.length === 1
      ? '/'
      : folderChain
          .map(item => item.name)
          .join('/')
          .slice(1);

  useImperativeHandle(
    forwardRef,
    /** @type {() => RefContent} */
    () => ({
      ls: retrieveFiles,
      getDeleteFiles: () => deletedFiles,
      getCWD,
      addFile: (file, folderId = currentFolderId, path = getCWD()) => {
        addFile({ file, folderId, path });
      },
      dropFile: id => {
        deleteFiles([fileMap[id]]);
      },
      resetFileMap,
      toggleFlat,
      getCurrentDirContent: () => files,
    })
  );

  return (
    <div style={{ height: 400 }}>
      <ChonkyFileBrowser
        files={files}
        folderChain={folderChain}
        fileActions={fileActions}
        defaultFileViewActionId={ChonkyActions.EnableListView.id}
        onFileAction={handleFileAction}>
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </ChonkyFileBrowser>
      <DebugWindow
        params={{
          deletedFiles,
          touchedFiles,
          currentDirectory: files,
          output: retrieveFiles(),
        }}
      />
    </div>
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
  onDelete: PropTypes.func,
};
FileBrowser.defaultProps = {
  files: [],
  onDelete: null,
};

export default WrappedFileBrowser;
