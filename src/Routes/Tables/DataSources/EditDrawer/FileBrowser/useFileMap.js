import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { notification } from 'utils';
import { stratify, flatten, generateFolderId } from './stratifier';

/**
 * @typedef {import('./stratifier').StratifiedFile} StratifiedFile
 * @typedef {import('./stratifier').StratifiedDirectory} StratifiedDirectory
 * @typedef {import('./stratifier').StratifiedMap} StratifiedMap
 * @typedef {import('antd/lib/upload/interface').UploadFile} UploadFile
 * @typedef {import('./').CustomFileData} CustomFileData
 */

export default (filesList, rootFolderId = '/') => {
  /** @type {StratifiedMap} */
  const baseMap = useMemo(() => stratify(filesList), [filesList]);
  const [fileMap, setFileMap] = useState(baseMap);

  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);
  // const [touchedFiles, setTouchedFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [addedFiles, setAddedFiles] = useState([]);

  // const tagFilesAsTouched = useCallback(
  //   fileIds => setTouchedFiles(state => [...new Set([...state, ...fileIds])]),
  //   [setTouchedFiles]
  // );

  // const unTagTouchedFiles = useCallback(
  //   fileIds => {
  //     setTouchedFiles(state => {
  //       const filesSet = new Set(fileIds);
  //       return state.filter(file => !filesSet.has(file));
  //     });
  //   },
  //   [setTouchedFiles]
  // );

  const tagFilesToDelete = useCallback(
    fileIds => setDeletedFiles(state => [...new Set([...state, ...fileIds])]),
    [setDeletedFiles]
  );

  const retrieveFiles = useCallback(() => flatten(fileMap), [fileMap]);

  const currentFolderIdRef = useRef(currentFolderId);

  useEffect(() => {
    currentFolderIdRef.current = currentFolderId;
  }, [currentFolderId]);

  const resetFileMap = useCallback(
    files => {
      const nextFileMap = stratify(files);
      setFileMap(nextFileMap);
      setCurrentFolderId(activeDirectory =>
        nextFileMap[activeDirectory] ? activeDirectory : rootFolderId
      );
      // setTouchedFiles([]);
      setDeletedFiles([]);
    },
    [rootFolderId]
  );

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
        /** @type {StratifiedDirectory} */
        const parentDir = oldFileMap[folderId];
        const existingFile = parentDir.childrenIds
          .map(id => oldFileMap[id])
          .find(item => !item.isDir && item.name === file.name);

        let nextMap = oldFileMap;
        if (existingFile) {
          const { [existingFile.id]: droppedFile, ...rest } = oldFileMap;
          nextMap = rest;
        }

        /** @type {StratifiedFile} */
        const fileEntry = {
          id: file.uid,
          parentId: folderId,
          name: file.name,
          path,
          size: file.size,
        };
        const nextChildrenIds = parentDir.childrenIds.concat(file.uid);
        return {
          ...nextMap,
          [file.uid]: fileEntry,
          [folderId]: {
            ...parentDir,
            ...(existingFile
              ? {
                  childrenIds: nextChildrenIds.filter(
                    id => id !== existingFile.id
                  ),
                }
              : {
                  children: parentDir.children + 1,
                  childrenIds: nextChildrenIds,
                }),
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
      // only existing files, files added for uploading and removed are ignored
      tagFilesToDelete(fileIds.filter(id => !addedFilesSet.has(id)));
      // unTagTouchedFiles(fileIds);
      setFileMap(oldFileMap => {
        const newFileMap = { ...oldFileMap };
        files.map(
          /** @param {StratifiedFile} file */
          file => {
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
          }
        );
        return newFileMap;
      });
    },
    [tagFilesToDelete, addedFiles]
    // [tagFilesToDelete, unTagTouchedFiles, addedFiles]
  );

  const moveFiles = useCallback(
    /**
     * @param {CustomFileData[]} files
     * @param {CustomFileData} source
     * @param {CustomFileData} destination
     */
    (files, source, destination) => {
      const destDirContent = destination.childrenIds.map(id => fileMap[id]);
      const byName = destDirContent
        .filter(file => !file.isDir)
        .reduce((acc, item) => ({ ...acc, [item.name]: item }), {});

      const { movedFiles, overrideFiles } = files.reduce(
        (acc, file) => {
          const existingFile = byName[file.name];
          if (!existingFile)
            return { ...acc, movedFiles: acc.movedFiles.concat(file) };
          return (
            // eslint-disable-next-line
            window.confirm(
              `file ${file.name} already exists would you like to override it?`
            )
              ? {
                  ...acc,
                  overrideFiles: acc.overrideFiles.concat(existingFile),
                  movedFiles: acc.movedFiles.concat(file),
                }
              : { ...acc, ignoredFiles: acc.ignoredFiles.concat(file) }
          );
        },
        {
          movedFiles: [],
          ignoredFiles: [],
          overrideFiles: [],
        }
      );

      const moveFileIds = new Set(movedFiles.map(f => f.id));

      // tagFilesAsTouched([...moveFileIds]);

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
        const overrideIds = new Set(overrideFiles.map(file => file.id));
        const newDestinationChildrenIds = [
          ...destination.childrenIds.filter(id => !overrideIds.has(id)),
          ...movedFiles.map(f => f.id),
        ];
        newFileMap[destination.id] = {
          ...destination,
          childrenIds: newDestinationChildrenIds,
          childrenCount: newDestinationChildrenIds.length,
        };
        movedFiles.map(file => {
          newFileMap[file.id] = {
            ...file,
            parentId: destination.id,
          };
          return undefined;
        });
        const nextMap = overrideFiles.reduce((acc, file) => {
          const { [file.id]: droppedFile, ...rest } = acc;
          return rest;
        }, newFileMap);
        return nextMap;
      });
    },
    [fileMap]
    // [tagFilesAsTouched, fileMap]
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
    tagFilesToDelete,
    deletedFiles,
    addFile,
  };
};
