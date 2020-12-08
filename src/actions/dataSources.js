import actions from 'const/application-actions';

/**
 * @typedef {{
 *   lastModified: number;
 *   lastModifiedDate: string;
 *   name: string;
 *   response: string;
 *   size: number;
 *   status: string;
 *   type: string;
 *   uid: string;
 * }} AntFile
 */

export const fetchDataSources = () => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: 'datasource/',
    actionType: actions.DATASOURCE_FETCH_ALL,
  },
});

export const fetchDataSource = ({ name, id }) => ({
  type: actions.REST_REQ_GET,
  payload: {
    url:
      id && name
        ? `datasource/${name}?version_id=${id}`
        : id
        ? `datasource/id/${id}`
        : `datasource/${name}`,
    actionType: actions.DATASOURCE_FETCH,
  },
  meta: {
    id,
  },
});

/**
 * @param {object} payload
 * @param {string} payload.name
 * @param {AntFile[]} payload.files
 * @param {object} meta
 * @param {function} meta.onSuccess
 */
export const createDataSource = ({ name, files }, { onSuccess }) => {
  const formData = new FormData();
  formData.append('name', name);
  files.forEach(file => {
    formData.append('files', file);
  });
  return {
    type: actions.REST_REQ_POST_FORM,
    payload: {
      url: 'datasource/',
      formData,
      actionType: actions.DATASOURCE_CREATE,
    },
    meta: {
      onSuccess,
    },
  };
};

/**
 * @typedef {{
 *   id: string;
 *   name: string;
 *   path: string;
 * }} MappingFile
 * @param {object} payload
 * @param {string} payload.dataSourceName
 * @param {AntFile[]} payload.files
 * @param {MappingFile[]=} payload.mapping
 * @param {string[]=} payload.droppedFileIds
 * @param {string} payload.versionDescription
 * @param {object} meta
 * @param {function} meta.onSuccess
 */
export const postVersion = (
  { dataSourceName, files, mapping, droppedFileIds = [], versionDescription },
  { onSuccess } = {}
) => {
  const formData = new FormData();
  formData.append('name', dataSourceName);

  const normalizedMapping = mapping.reduce(
    (acc, item) => ({ ...acc, [item.id]: item }),
    {}
  );

  files.forEach(file => {
    formData.append(
      'files',
      file,
      normalizedMapping[file.uid] ? file.uid : file.name
    );
  });

  formData.append('versionDescription', versionDescription);

  formData.append('mapping', JSON.stringify(mapping.length > 0 ? mapping : []));

  formData.append(
    'droppedFileIds',
    JSON.stringify(droppedFileIds.length > 0 ? droppedFileIds : [])
  );

  return {
    type: actions.REST_REQ_POST_FORM,
    payload: {
      url: `datasource/${dataSourceName}`,
      formData,
      actionType: actions.DATASOURCE_POST_VERSION,
    },
    meta: {
      onSuccess,
    },
  };
};
