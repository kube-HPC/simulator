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
