import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { notification } from 'utils';
import { stratify, flatten, generateFolderId } from './stratifier';

/**
 * @typedef {import('./stratifier').StratifiedFile} StratifiedFile
 * @typedef {import('./stratifier').StratifiedDirectory} StratifiedDirectory
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 */

export default (filesList, rootFolderId = '/') => {
  const baseMap = useMemo(() => stratify(filesList), [filesList]);
  const [fileMap, setFileMap] = useState(baseMap);

  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);
  const [touchedFiles, setTouchedFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [addedFiles, setAddedFiles] = useState([]);

  const tagFilesAsTouched = useCallback(
    fileIds => setTouchedFiles(state => [...new Set([...state, ...fileIds])]),
    [setTouchedFiles]
  );

  const unTagTouchedFiles = useCallback(
    fileIds => {
      setTouchedFiles(state => {
        const filesSet = new Set(fileIds);
        return state.filter(file => !filesSet.has(file));
      });
    },
    [setTouchedFiles]
  );

  const tagFilesToDelete = useCallback(
    fileIds => setDeletedFiles(state => [...new Set([...state, ...fileIds])]),
    [setDeletedFiles]
  );

  const retrieveFiles = useCallback(() => flatten(fileMap), [fileMap]);

  const currentFolderIdRef = useRef(currentFolderId);

  useEffect(() => {
    currentFolderIdRef.current = currentFolderId;
  }, [currentFolderId]);

  const resetFileMap = useCallback(() => {
    setFileMap(baseMap);
    setCurrentFolderId(rootFolderId);
    setTouchedFiles([]);
    setDeletedFiles([]);
  }, [baseMap, rootFolderId]);

  const addFile = useCallback(
    /**
     * @param {object} props
     * @param {UploadFile} props.file
     * @param {string} props.folderId
     * @param {string} props.path
     */
    ({ file, folderId, path }) => {
      setAddedFiles(state => state.concat(file.uid));
      setFileMap(oldFileMap => {
        /** @type {StratifiedFile} */
        const fileEntry = {
          id: file.uid,
          parentId: folderId,
          name: file.name,
          path,
          size: file.size,
        };

        /** @type {StratifiedDirectory} */
        const parentDir = oldFileMap[folderId];

        return {
          ...oldFileMap,
          [file.uid]: fileEntry,
          [folderId]: {
            ...parentDir,
            children: parentDir.children + 1,
            childrenIds: parentDir.childrenIds.concat(file.uid),
          },
        };
      });
    },
    [setFileMap]
  );

  const deleteFiles = useCallback(
    /** @param {CustomFileData[]} files */
    files => {
      const fileIds = files.map(file => file.id);
      const addedFilesSet = new Set(addedFiles);
      const filesToDeleteSet = new Set(fileIds);
      // drop from the files added collection
      setAddedFiles(state =>
        state.filter(fileId => !filesToDeleteSet.has(fileId))
      );
      // tag files to delete
      // only existing files, files added for uploading and removed are ignored
      tagFilesToDelete(fileIds.filter(id => !addedFilesSet.has(id)));
      unTagTouchedFiles(fileIds);
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
      });
    },
    [tagFilesToDelete, unTagTouchedFiles, addedFiles]
  );

  const moveFiles = useCallback(
    /**
     * @param {CustomFileData[]} files
     * @param {CustomFileData} source
     * @param {CustomFileData} destination
     */
    (files, source, destination) => {
      const moveFileIds = new Set(files.map(f => f.id));
      tagFilesAsTouched([...moveFileIds]);

      setFileMap(oldFileMap => {
        const newFileMap = { ...oldFileMap };
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
      });
    },
    [tagFilesAsTouched]
  );

  const createFolder = useCallback(
    /** @param {string} folderName */
    folderName =>
      setFileMap(oldFileMap => {
        const parent = oldFileMap[currentFolderIdRef.current];

        const childrenNames = new Set(
          oldFileMap[currentFolderIdRef.current].childrenIds.map(
            childId => oldFileMap[childId].name
          )
        );

        if (childrenNames.has(folderName)) {
          notification({
            message: `folder name "${folderName}" already exists in this directory`,
          });
          return oldFileMap;
        }

        const folderId = generateFolderId(folderName);
        const newFileMap = {
          ...oldFileMap,
          [folderId]: {
            id: folderId,
            name: folderName,
            isDir: true,
            modDate: new Date(),
            parentId: currentFolderIdRef.current,
            childrenIds: [],
            childrenCount: 0,
          },
          [currentFolderIdRef.current]: {
            ...parent,
            childrenIds: [...parent.childrenIds, folderId],
          },
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
    touchedFiles,
    tagFilesAsTouched,
    tagFilesToDelete,
    deletedFiles,
    addFile,
  };
};
