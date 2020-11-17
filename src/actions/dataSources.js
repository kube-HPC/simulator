import actions from 'const/application-actions';

export const fetchDataSources = () => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: 'datasource/',
    actionType: actions.DATASOURCE_FETCH_ALL,
  },
});

export const fetchDataSource = ({ name }) => ({
  type: actions.REST_REQ_GET,
  payload: {
    url: `datasource/${name}`,
    actionType: actions.DATASOURCE_FETCH,
  },
});

/**
 * @param {object} payload
 * @param {string} payload.name
 * @param {any[]} payload.files
 * @param {object} meta
 * @param {function} meta.onSuccess
 */
export const createDataSource = ({ name, files }, { onSuccess }) => {
  const formData = new FormData();
  formData.append('name', name);
  files.forEach(file => formData.append('files', file));
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
