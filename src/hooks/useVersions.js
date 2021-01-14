import { useState, useEffect, useCallback } from 'react';
import { notification } from 'utils';
import client from './../client';

const errorNotification = ({ message }) => notification({ message });

const fetchVersion = ({ algorithmName, callback }) =>
  client
    .get(`/versions/algorithms/${algorithmName}`)
    .then(({ data }) => {
      callback(data);
    })
    .catch(errorNotification);

const applyVersion = ({ name, version }) =>
  client
    .post(`/versions/algorithms/apply`, { name, version })
    .catch(errorNotification);

const deleteVersion = ({ name, version }) =>
  client
    .delete(`/versions/algorithms/${name}/${version}`)
    .catch(errorNotification);

const useVersions = ({ algorithmName, isFetch }) => {
  const [dataSource, setDataSource] = useState(undefined);

  const fetch = useCallback(
    () => fetchVersion({ algorithmName, callback: setDataSource }),
    [algorithmName]
  );

  useEffect(() => {
    if (isFetch) {
      fetch();
    }
  }, [algorithmName, fetch, isFetch]);

  return {
    dataSource,
    onApply: applyVersion,
    onDelete: deleteVersion,
    fetch,
  };
};

export default useVersions;
