/**
 * @typedef {{
 *   name: string;
 *   id: string;
 *   path: string;
 *   size: number;
 *   type: string;
 *   description: string;
 *   uploadedAt?: number;
 * }} FlatFile
 *
 * @typedef {{
 *   parentId: string;
 *   isHidden?: boolean;
 *   overrideFile?: string;
 * } & FlatFile} StratifiedFile
 *
 * @typedef {{
 *   id: string;
 *   name: string;
 *   children: number;
 *   isDir: true;
 *   childrenIds: string[];
 *   parentId?: string;
 * }} StratifiedDirectory
 *
 * @typedef {{
 *   [id: string]: StratifiedDirectory | StratifiedFile;
 * }} StratifiedMap
 */

const ROOT_ID = '/';

export const generateFolderId = folderName =>
  `${Math.floor(Math.random().toFixed(4) * 10 ** 4)}-${folderName}`;

/** @type {(flatList: FlatFile[]) => StratifiedMap} */
export const stratify = flatList => {
  /**
   * Holds all the directories by their paths used to ensure each directory
   * appears only once and has a unique id
   *
   * @typedef {{
   *   [directoryPath: string]: { id: string; dir: string };
   * }} PathsMap
   * @type {PathsMap}
   */
  let pathsMap = {};

  if (flatList.length === 0)
    return {
      [ROOT_ID]: {
        children: 0,
        childrenIds: [],
        id: ROOT_ID,
        isDir: true,
        name: '/',
      },
    };

  /** @type {StratifiedMap} */
  const stratifiedMap = flatList.reduce((acc, file) => {
    /** @type {PathsMap} */
    const parentDirsMap = Object.fromEntries([
      [ROOT_ID, { dir: '/', id: ROOT_ID }],
      ...file.path
        .split('/')
        .filter(subPath => subPath)
        .map((dir, ii, completePath) => {
          const directoryPath = completePath.slice(0, ii + 1).join('/');
          const entry = pathsMap[directoryPath];
          // ensure each entry appears only once
          return entry
            ? [directoryPath, entry]
            : [
                directoryPath,
                {
                  dir,
                  id: generateFolderId(dir),
                },
              ];
        }),
    ]);

    pathsMap = { ...parentDirsMap, ...pathsMap };

    const parentDirs = Object.values(parentDirsMap);

    const nextDirs = parentDirs
      .slice()
      .sort((a, b) => {
        if (a.id === ROOT_ID) return -1;
        if (b.id === ROOT_ID) return 1;
        return 0;
      })
      .map(({ dir, id: dirId }, ii, collection) => {
        let childrenIds = acc[dirId]?.childrenIds ?? [];

        childrenIds =
          ii !== collection.length - 1
            ? childrenIds.concat(collection[ii + 1].id)
            : childrenIds.concat(file.id);

        childrenIds = [...new Set(childrenIds)];

        return [
          dirId,
          {
            id: dirId,
            name: dir,
            isDir: true,
            children: childrenIds.length,
            childrenIds,
            ...(ii !== 0
              ? {
                  parentId: collection[ii - 1].id,
                }
              : {}),
          },
        ];
      });

    return {
      ...acc,
      ...Object.fromEntries(nextDirs),
      [file.id]: {
        ...file,
        parentId: parentDirs[parentDirs.length - 1].id,
      },
    };
  }, {});

  return stratifiedMap;
};

/** @type {(file: StratifiedDirectory, mapping: StratifiedMap) => string[]} */
const restorePath = (folder, mapping) =>
  folder.parentId
    ? restorePath(mapping[folder.parentId], mapping).concat(folder.name)
    : [''];

/** @type {(mapping: StratifiedMap) => FlatFile[]} */
export const flatten = mapping => {
  /** @type {StratifiedFile[]} */
  // @ts-ignore
  const files = Object.values(mapping).filter(item => !item.isDir);
  return files.map(file => {
    const { parentId, overrideFile, isHidden, ...rest } = file;
    return {
      ...rest,
      path: restorePath(mapping[file.parentId], mapping).join('/') || '/',
    };
  });
};
