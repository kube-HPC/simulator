/**
 * @typedef {{
 *   name: string;
 *   id: string;
 *   path: string;
 *   size: number;
 *   tags: string[];
 * }} FlatFile
 * @typedef {{ parentId: string } & FlatFile} StratifiedFile
 * @typedef {{
 *   id: string;
 *   name: string;
 *   children: number;
 *   isDir: true;
 *   childrenIds: string[];
 *   parentId?: string;
 * }} StratifiedDirectory
 * @typedef {{
 *   [x: string]: StratifiedDirectory | StratifiedFile;
 * }} StratifiedMap
 */

/** @type {(flatList: FlatFile[]) => StratifiedMap} */
export const stratify = flatList => {
  /** @type {StratifiedMap} */
  const stratifiedMap = flatList.reduce((acc, file) => {
    const parentDirs = [
      '/',
      ...file.path.split('/').filter(subPath => subPath),
    ];

    const nextDirs = parentDirs.map((dir, ii) => {
      let childrenIds = acc[dir]?.childrenIds ?? [];

      childrenIds =
        ii !== parentDirs.length - 1
          ? childrenIds.concat(parentDirs[ii + 1])
          : childrenIds.concat(file.id);

      childrenIds = [...new Set(childrenIds)];

      return [
        dir,
        {
          id: dir,
          name: dir,
          isDir: true,
          children: childrenIds.length,
          childrenIds,
          ...(ii !== 0
            ? {
                parentId: parentDirs[ii - 1],
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
        parentId: parentDirs[parentDirs.length - 1],
      },
    };
  }, {});
  return stratifiedMap;
};

/** @type {(file: StratifiedDirectory, mapping: StratifiedMap) => string[]} */
const restorePath = (folder, mapping) => {
  return folder.parentId
    ? restorePath(mapping[folder.parentId], mapping).concat(folder.id)
    : [''];
};

/** @type {(mapping: StratifiedMap) => FlatFile[]} */
export const flatten = mapping => {
  /** @type {StratifiedFile[]} */
  // @ts-ignore
  const files = Object.values(mapping).filter(item => !item.isDir);
  return files.map(file => {
    const { parentId, ...rest } = file;
    return {
      ...rest,
      path: restorePath(mapping[file.parentId], mapping).join('/') || '/',
    };
  });
};
