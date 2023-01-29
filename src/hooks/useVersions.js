import { useState, useEffect, useCallback } from 'react';
import { notification } from 'utils';

import client from './../client';

const errorNotification = ({ message }) => notification({ message });

const useVersions = ({ algorithmName, confirmPopupForceVersion, isFetch }) => {
  const [dataSource, setDataSource] = useState(undefined);

  const fetchVersion = useCallback(
    () =>
      client
        .get(`/versions/algorithms/${algorithmName}`)
        .then(({ data }) => {
          setDataSource(data);
        })
        .catch(errorNotification),
    [algorithmName]
  );

  const fetch = useCallback(() => fetchVersion(), [fetchVersion]);

  const deleteVersion = ({ name, version }) =>
    client
      .delete(`/versions/algorithms/${name}/${version}`)
      .then(() => {
        fetchVersion();
      })
      .catch(errorNotification);

  const applyVersion = ({ name, version, force }) => {
    client
      .post(`/versions/algorithms/apply`, { name, version, force })
      .catch(error => {
        confirmPopupForceVersion(
          error.response.data,
          name,
          version,
          applyVersion
        );
      });
  };

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
