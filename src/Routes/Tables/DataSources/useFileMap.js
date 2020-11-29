import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { stratify, flatten } from './stratifier';

export default (filesList, rootFolderId = '/') => {
  const baseMap = useMemo(() => stratify(filesList), [filesList]);
  const [fileMap, setFileMap] = useState(baseMap);
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);
  const [touchedFiles, setTouchedFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);

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

  const deleteFiles = useCallback(
    /** @param {CustomFileData[]} files */
    files => {
      const fileIds = files.map(file => file.id);
      tagFilesToDelete(fileIds);
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
    [tagFilesToDelete, unTagTouchedFiles]
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
        const newFileMap = {
          ...oldFileMap,
          [folderName]: {
            id: folderName,
            name: folderName,
            isDir: true,
            modDate: new Date(),
            parentId: currentFolderIdRef.current,
            childrenIds: [],
            childrenCount: 0,
          },
          [currentFolderIdRef.current]: {
            ...parent,
            childrenIds: [...parent.childrenIds, folderName],
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
  };
};
