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
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import useFileMap from './useFileMap';

/**
 * @typedef {import('chonky').ChonkyFileActionData} ChonkyFileActionData
 * @typedef {import('chonky').FileArray} FileArray
 * @typedef {import('chonky').FileData} FileData
 * @typedef {import('antd/lib/upload/interface').UploadFile}
 * @typedef {import('./stratifier').StratifiedDirectory} StratifiedDirectory
 * @typedef {import('./stratifier').StratifiedFile} StratifiedFile
 * @typedef {import('./stratifier').StratifiedMap} StratifiedMap
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

/**
 * @type {(
 *   dir: StratifiedDirectory,
 *   mapping: StratifiedMap
 * ) => StratifiedFile[]}
 */
const resolveSubDir = (dir, mapping) =>
  dir.childrenIds
    .map(child => {
      const entry = mapping[child];
      return entry.isDir ? resolveSubDir(entry, mapping) : entry;
    })
    .flat();
/**
 * @type {(
 *   dir: (StratifiedDirectory | StratifiedFile)[],
 *   mapping: StratifiedMap
 * ) => StratifiedFile[]}
 */
const collectFiles = (files, mapping) =>
  files
    .filter(file => file.uploadedAt || file.isDir) // drop files that were never uploaded
    .map(file => (file.isDir ? resolveSubDir(file, mapping) : file))
    .flat();

const FileBrowser = ({
  files: srcFiles,
  forwardRef,
  onDelete,
  isReadOnly,
  onDownload,
}) => {
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
          const { targetFile, files: _files } = action.payload;
          // eslint-disable-next-line
          const fileToOpen = targetFile ?? _files[0];
          if (
            fileToOpen &&
            FileHelper.isDirectory(fileToOpen) &&
            action.payload.files.length === 1
          ) {
            // console.log({ payload: action.payload });
            setCurrentFolderId(fileToOpen.id);
          } else {
            const filesToDownload = collectFiles(
              action.payload.files,
              fileMap
            ).map(file => file.id);

            return onDownload(filesToDownload);
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
    [
      createFolder,
      deleteFiles,
      moveFiles,
      setCurrentFolderId,
      onDelete,
      fileMap,
      onDownload,
    ]
  );

  const handleReadOnlyAction = useCallback(
    /** @param {ChonkyFileActionData} action */
    action => {
      if (action.id === ChonkyActions.OpenFiles.id) {
        const { targetFile, files: _files } = action.payload;
        const fileToOpen = targetFile ?? _files[0];
        if (fileToOpen && FileHelper.isDirectory(fileToOpen))
          setCurrentFolderId(fileToOpen.id);
        else {
          // console.log({ fileToOpen });
        }
      }
      return null;
    },
    [setCurrentFolderId]
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
    <ChonkyFileBrowser
      files={files}
      folderChain={folderChain}
      fileActions={isReadOnly ? [] : fileActions}
      defaultFileViewActionId={ChonkyActions.EnableListView.id}
      onFileAction={isReadOnly ? handleReadOnlyAction : handleFileAction}>
      <FileNavbar />
      <FileToolbar />
      <FileList />
      <FileContextMenu />
    </ChonkyFileBrowser>
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
  onDownload: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isReadOnly: PropTypes.bool,
};
FileBrowser.defaultProps = {
  files: [],
  onDelete: null,
  isReadOnly: false,
};

export default WrappedFileBrowser;