import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { notification } from 'utils';
import axios from 'axios';
import { selectors } from 'reducers';

const errorNotification = ({ message }) => notification({ message });

const fetchVersion = ({ url, algorithmName, callback }) =>
  axios
    .get(`${url}/versions/algorithms/${algorithmName}`)
    .then(({ data }) => {
      callback(data);
    })
    .catch(errorNotification);

const applyVersion = ({ url }) => ({ name, version }) =>
  axios
    .post(`${url}/versions/algorithms/apply`, { name, version })
    .catch(errorNotification);

const deleteVersion = ({ url }) => ({ name, version }) =>
  axios
    .delete(`${url}/versions/algorithms/${name}/${version}`)
    .catch(errorNotification);

const useVersions = ({ algorithmName, isFetch }) => {
  const [dataSource, setDataSource] = useState(undefined);
  const { socketURL } = useSelector(selectors.connection.stats);
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
