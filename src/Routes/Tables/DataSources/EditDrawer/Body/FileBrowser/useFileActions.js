import { useMemo, useCallback } from 'react';
import { ChonkyActions, FileHelper } from 'chonky';

/**
 * @typedef {import('./stratifier').StratifiedDirectory} StratifiedDirectory
 * @typedef {import('./stratifier').StratifiedFile} StratifiedFile
 * @typedef {import('./stratifier').StratifiedMap} StratifiedMap
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

/** @typedef {import('chonky').ChonkyFileActionData} ChonkyFileActionData */

/**
 * @type {(
 *   onDownload: function
 * ) => (action: ChonkyFileActionData, fileMap: StratifiedMap) => void}
 */
export const handleDownload = onDownload => ({ state }, fileMap) => {
  const filesToDownload = collectFiles(state.selectedFiles, fileMap).map(
    file => file.id
  );
  return onDownload && onDownload(filesToDownload);
};

/** @type {(onDelete: function) => (action: ChonkyFileActionData) => void} */
export const handleDelete = onDelete => ({ state }) => {
  onDelete && onDelete(state.selectedFilesForAction);
};

/** @type {(onMove: function) => (action: ChonkyFileActionData) => void} */
export const handleMove = onMove => ({ payload }) =>
  onMove(payload.files, payload.source, payload.destination);

/** @type {(onOpen: function) => (action: ChonkyFileActionData) => void} */
export const handleOpen = onOpen => ({ payload }) => {
  const fileToOpen = payload.targetFile ?? payload.files[0];
  if (
    fileToOpen &&
    FileHelper.isDirectory(fileToOpen) &&
    payload.files.length === 1
  ) {
    onOpen(fileToOpen.id);
  }
  return null;
};

/** @type {(onCreateFolder: function) => () => void} */
export const handleCreateFolder = onCreateFolder => () => {
  // eslint-disable-next-line
  const folderName = prompt('Enter a name for your new folder:');
  if (folderName) onCreateFolder(folderName);
  return null;
};

export default (
  fileMap,
  isReadOnly,
  { onOpen, onDownload, onDelete, onMove, onCreateFolder }
) => {
  const { handlers, fileActions } = useMemo(
    () =>
      isReadOnly
        ? {
            handlers: {
              [ChonkyActions.OpenFiles.id]: handleOpen(onOpen),
              [ChonkyActions.DownloadFiles.id]: handleDownload(onDownload),
            },
            fileActions: [ChonkyActions.DownloadFiles],
          }
        : {
            handlers: {
              [ChonkyActions.OpenFiles.id]: handleOpen(onOpen),
              [ChonkyActions.DownloadFiles.id]: handleDownload(onDownload),
              [ChonkyActions.DeleteFiles.id]: handleDelete(onDelete),
              [ChonkyActions.MoveFiles.id]: handleMove(onMove),
              [ChonkyActions.CreateFolder.id]: handleCreateFolder(
                onCreateFolder
              ),
            },
            fileActions: [
              ChonkyActions.DownloadFiles,
              ChonkyActions.CreateFolder,
              ChonkyActions.DeleteFiles,
            ],
          },
    [isReadOnly, onDelete, onMove, onOpen, onDownload, onCreateFolder]
  );

  const handleFileAction = useCallback(
    /** @param {ChonkyFileActionData} action */
    action => {
      const handler = handlers[action.id];
      return handler ? handler(action, fileMap) : null;
    },
    [handlers, fileMap]
  );
  return { handleFileAction, handlers, fileActions };
};
