import { useState, useEffect, useCallback } from 'react';
import { notification } from 'utils';

import client from './../client';

const errorNotification = ({ message }) => notification({ message });

const useVersions = ({
  nameId,
  confirmPopupForceVersion,
  isFetch,
  urlRestData,
}) => {
  const [dataSource, setDataSource] = useState(undefined);

  const fetchVersion = useCallback(
    () =>
      client
        .get(`/versions/${urlRestData}/${nameId}`)
        .then(({ data }) => {
          setDataSource(data);
        })
        .catch(errorNotification),
    [nameId, urlRestData]
  );

  const fetch = useCallback(() => fetchVersion(), [fetchVersion]);

  const deleteVersion = ({ name, version }) =>
    client
      .delete(`/versions/${urlRestData}/${name}/${version}`)
      .then(() => {
        fetchVersion();
      })
      .catch(errorNotification);

  const applyVersion = ({ name, version, force }) => {
    client
      .post(`/versions/${urlRestData}/apply`, { name, version, force })
      .catch(error => {
        if (confirmPopupForceVersion) {
          confirmPopupForceVersion(
            error.response.data,
            name,
            version,
            applyVersion
          );
        }
      });
  };

  useEffect(() => {
    if (isFetch) {
      fetch();
    }
  }, [nameId, fetch, isFetch]);

  return {
    dataSource,
    onApply: applyVersion,
    onDelete: deleteVersion,
    fetch,
  };
};

export default useVersions;
