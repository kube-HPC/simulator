import axios from 'axios';
/** @typedef {import('./datasource.d').DataSource} DataSource */
/** @typedef {import('./datasource.d').DataSourceMeta} DataSourceMeta */

/** @type {() => import('axios').AxiosPromise<DataSourceMeta[]>} */
export const fetchDataSources = () => axios.get('/datasources');

/** @type {(name: string) => import('axios').AxiosPromise<DataSource>} */
export const fetchDataSource = name => axios.get(`/datasources/${name}`);

/**
 * @type {(props: {
 *   name: string;
 *   file: string;
 * }) => import('axios').AxiosPromise<DataSource>}
 */
export const createDataSource = ({ name, file }) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('file', file);
  return axios.post(`/datasources`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * @type {(props: {
 *   dataSourceName: string;
 *   file: any;
 * }) => import('axios').AxiosPromise<DataSource>}
 */
export const uploadFile = ({ dataSourceName, file }) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`/datasources/${dataSourceName}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
