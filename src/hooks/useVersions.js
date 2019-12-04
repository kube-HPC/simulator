import { useState, useEffect } from 'react';
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

const applyVersion = ({ url }) => ({ name, image }) =>
  axios.post(`${url}/versions/algorithms/apply`, { name, image }).catch(errorNotification);

const deleteVersion = ({ url }) => ({ name, algorithmImage }) =>
  axios
    .delete(`${url}/versions/algorithms/${name}/${encodeURIComponent(algorithmImage)}`)
    .catch(errorNotification);

const useVersions = ({ algorithmName, isFetch }) => {
  const [dataSource, setDataSource] = useState(undefined);
  const socketURL = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);
  const onApply = applyVersion({ url: socketURL });
  const onDelete = deleteVersion({ url: socketURL });

  useEffect(() => {
    if (isFetch) {
      fetchVersion({ url: socketURL, algorithmName, callback: setDataSource });
    }
  }, [algorithmName, isFetch]);

  return {
    dataSource,
    onApply,
    onDelete,
  };
};

export default useVersions;
