import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'utils';
import { STATE_SOURCES } from 'const';
import axios from 'axios';

const errorNotification = ({ message }) => notification({ message });

const fetchVersion = ({ url, algorithmName, callback }) =>
  axios
    .get(`${url}/versions/algorithms/${algorithmName}`)
    .then(({ data }) => {
      callback(data);
    })
    .catch(errorNotification);

const applyVersion = ({ url }) => ({ id, name }) =>
  axios
    .post(`${url}/versions/algorithms/apply`, { id, name })
    .catch(errorNotification);

const deleteVersion = ({ url }) => ({ id, name }) =>
  axios
    .delete(`${url}/versions/algorithms/${name}/${id}`)
    .catch(errorNotification);

const useVersions = ({ algorithmName, isFetch }) => {
  const [dataSource, setDataSource] = useState(undefined);
  const socketURL = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);
  const onApply = applyVersion({ url: socketURL });
  const onDelete = deleteVersion({ url: socketURL });

  const fetch = useCallback(
    () =>
      fetchVersion({ url: socketURL, algorithmName, callback: setDataSource }),
    [algorithmName, socketURL]
  );

  useEffect(() => {
    if (isFetch) {
      fetch();
    }
  }, [algorithmName, fetch, isFetch, socketURL]);

  return {
    dataSource,
    onApply,
    onDelete,
    fetch,
  };
};

export default useVersions;
