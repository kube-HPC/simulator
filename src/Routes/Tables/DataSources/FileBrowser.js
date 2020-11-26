import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
import { stratify, flatten } from './stratifier';

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

export const useCustomFileMap = (filesList, rootFolderId = '/') => {
  const baseMap = useMemo(() => stratify(filesList), [filesList]);
  const [fileMap, setFileMap] = useState(baseMap);
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);

  const retrieveFiles = useCallback(() => flatten(fileMap), [fileMap]);

  const currentFolderIdRef = useRef(currentFolderId);

  useEffect(() => {
    currentFolderIdRef.current = currentFolderId;
  }, [currentFolderId]);

  const resetFileMap = useCallback(() => {
    setFileMap(baseMap);
    setCurrentFolderId(rootFolderId);
  }, [baseMap, rootFolderId]);

  const deleteFiles = useCallback(
    /** @param {CustomFileData[]} files */
    files =>
      setFileMap(oldFileMap => {
        const newFileMap = { ...oldFileMap };
        files.map(file => {
          delete newFileMap[file.id];
          if (file.parentId) {
            const parent = newFileMap[file.parentId];
            const newChildrenIds = parent.childrenIds.filter(
              /** @param {string} id */
              id => id !== file.id
            );
            newFileMap[file.parentId] = {
              ...parent,
              childrenIds: newChildrenIds,
              childrenCount: newChildrenIds.length,
            };
          }
          return undefined;
        });
        return newFileMap;
      }),
    []
  );

  const moveFiles = useCallback(
    /**
     * @param {CustomFileData[]} files
     * @param {CustomFileData} source
     * @param {CustomFileData} destination
     */
    (files, source, destination) =>
      setFileMap(oldFileMap => {
        const newFileMap = { ...oldFileMap };

        const moveFileIds = new Set(files.map(f => f.id));
        const newSourceChildrenIds = source.childrenIds.filter(
          id => !moveFileIds.has(id)
        );
        newFileMap[source.id] = {
          ...source,
          childrenIds: newSourceChildrenIds,
          childrenCount: newSourceChildrenIds.length,
        };
        const newDestinationChildrenIds = [
          ...destination.childrenIds,
          ...files.map(f => f.id),
        ];
        newFileMap[destination.id] = {
          ...destination,
          childrenIds: newDestinationChildrenIds,
          childrenCount: newDestinationChildrenIds.length,
        };
        files.map(file => {
          newFileMap[file.id] = {
            ...file,
            parentId: destination.id,
          };
          return undefined;
        });
        return newFileMap;
      }),
    []
  );

  const createFolder = useCallback(
    /** @param {string} folderName */
    folderName =>
      setFileMap(oldFileMap => {
        const newFileMap = { ...oldFileMap };
        newFileMap[folderName] = {
          id: folderName,
          name: folderName,
          isDir: true,
          modDate: new Date(),
          parentId: currentFolderIdRef.current,
          childrenIds: [],
          childrenCount: 0,
        };
        const parent = newFileMap[currentFolderIdRef.current];
        newFileMap[currentFolderIdRef.current] = {
          ...parent,
          childrenIds: [...parent.childrenIds, folderName],
        };
        return newFileMap;
      }),
    [currentFolderIdRef]
  );

  return {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
    retrieveFiles,
  };
};

const fileActions = [ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles];

/** @type {(file: FileData) => string} */
const generateThumbnail = file =>
  file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null;

const FileBrowser = ({ files: srcFiles }) => {
  const {
    fileMap,
    currentFolderId,
    setCurrentFolderId,
    resetFileMap,
    deleteFiles,
    moveFiles,
    createFolder,
    retrieveFiles,
  } = useCustomFileMap(srcFiles);

  const [isFlat, setIsFlat] = useState(false);
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
    /** @param {ChonkyFileActionData} data */
    data => {
      switch (data.id) {
        case ChonkyActions.DeleteFiles.id:
          return deleteFiles(data.state.selectedFilesForAction);
        case ChonkyActions.MoveFiles.id:
          // eslint-disable-next-line
          const { payload } = data;
          return moveFiles(payload.files, payload.source, payload.destination);
        case ChonkyActions.OpenFiles.id:
          // eslint-disable-next-line
          const { targetFile, files } = data.payload;
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

  return (
    <>
      <button type="button" onClick={resetFileMap} style={{ marginBottom: 10 }}>
        Reset file map
      </button>
      <button type="button" onClick={() => console.log(retrieveFiles())}>
        print updated files
      </button>
      <button type="button" onClick={() => setIsFlat(state => !state)}>
        toggle flat
      </button>
      <div style={{ height: 400 }}>
        <ChonkyFileBrowser
          files={files}
          folderChain={folderChain}
          fileActions={fileActions}
          onFileAction={handleFileAction}
          thumbnailGenerator={generateThumbnail}>
          <FileNavbar />
          <FileToolbar />
          <FileList />
          <FileContextMenu />
        </ChonkyFileBrowser>
        <pre>{JSON.stringify(retrieveFiles(), null, 2)}</pre>
      </div>
    </>
  );
};

FileBrowser.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      isDir: PropTypes.bool,
    })
  ),
};
FileBrowser.defaultProps = {
  files: [],
};

export default FileBrowser;
