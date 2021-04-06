import React, {
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
  FileList,
  FileNavbar,
  FileToolbar,
  setChonkyDefaults,
} from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import useFileMap from './useFileMap';
import useFileActions from './useFileActions';

/**
 * @typedef {import('chonky').ChonkyFileActionData} ChonkyFileActionData
 *
 * @typedef {import('chonky').FileArray} FileArray
 *
 * @typedef {import('chonky').FileData} FileData
 *
 * @typedef {import('antd/lib/upload/interface').UploadFile}
 *
 * @typedef {import('./stratifier').StratifiedDirectory} StratifiedDirectory
 *
 * @typedef {import('./stratifier').StratifiedFile} StratifiedFile
 *
 * @typedef {import('./stratifier').StratifiedMap} StratifiedMap
 *
 * @typedef {FileData & {
 *   parentId?: string;
 *   childrenIds?: string[];
 * }} CustomFileData
 *
 * @typedef {{
 *   [fileId: string]: CustomFileData;
 * }} CustomFileMap
 *
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

  const actionsMap = useFileActions(fileMap, isReadOnly, {
    onOpen: setCurrentFolderId,
    onDownload,
    onDelete,
    onMove: moveFiles,
    onCreateFolder: createFolder,
  });

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
      fileActions={actionsMap.fileActions}
      defaultFileViewActionId={ChonkyActions.EnableListView.id}
      onFileAction={actionsMap.handleFileAction}>
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
