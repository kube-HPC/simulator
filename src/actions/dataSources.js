import actions from 'const/application-actions';

/** @typedef {import('Routes/Tables/DataSources/EditDrawer').UploadFile} UploadFile */

export const fetchDataSources = () => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: 'datasource/',
    actionType: actions.DATASOURCE_FETCH_ALL,
  },
});

export const fetchDataSourceVersions = ({ name }) => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: `datasource/${name}/versions`,
    actionType: actions.DATASOURCE_FETCH_VERSIONS,
  },
  meta: {
    dataSource: name,
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

export const fetchSnapshots = ({ name }) => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: `/datasource/${name}/snapshot`,
    actionType: actions.SNAPSHOT_FETCH_ALL,
  },
  meta: { name },
});

export const createSnapshot = ({ dataSourceId, query }) => ({
  type: actions.REST_REQ_POST,
  payload: {
    url: `/datasource/id/${dataSourceId}/snapshot`,
    body: { query },
    actionType: actions.SNAPSHOT_POST,
  },
  meta: { dataSourceId },
});

/**
 * @param {{
 *   name: string;
 *   files: UploadFile[];
 * }} payload
 * @param {{ onSuccess: function }} meta
 */
export const createDataSource = ({ name, files }, { onSuccess }) => {
  const formData = new FormData();
  formData.append('name', name);
  files.forEach(file => {
    formData.append('files', file.originFileObj);
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
 * @param {{
 *   dataSourceName: string;
 *   files?: UploadFile;
 *   mapping?: MappingFile;
 *   droppedFileIds?: string;
 *   versionDescription: string;
 * }} payload
 * @param {{ meta: function }} meta
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
      file.originFileObj,
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
      dataSourceName,
    },
  };
};
