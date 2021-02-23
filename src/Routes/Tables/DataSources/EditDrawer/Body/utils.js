import _ from 'lodash';
/**
 * @param {import('./VersionSelect').DataSourceVersion} collection
 * @param {import('./VersionSelect').ExtendedDataSource} entry
 */
export const checkLatest = (collection, entry) => {
  if (!entry || !collection) return false;
  return _.last(collection).id === entry.id;
};
