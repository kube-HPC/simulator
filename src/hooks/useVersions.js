import { useState, useEffect, useCallback } from 'react';
import { notification } from 'utils';

import client from './../client';

const errorNotification = err => {
  let msg = 'An unexpected error occurred';

  if (typeof err === 'string') {
    msg = err;
  } else if (err?.response?.data?.error?.message) {
    //  handles { error: { message: "..." } }
    msg = err.response.data.error.message;
  } else if (err?.response?.data?.message) {
    // fallback if backend sometimes sends { message: "..." } directly
    msg = err.response.data.message;
  } else if (err?.message) {
    msg = err.message;
  }

  notification({ message: msg });
};

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

  const saveAsVersion = useCallback(
    ({ name, version, newPipelineName, newAlgorithmName }) => {
      const selectedRecord = dataSource?.find(
        record => record.name === name && record.version === version
      );

      if (!selectedRecord) {
        errorNotification({
          message: 'Selected version not found in dataSource.',
        });
        return;
      }

      const newName = newAlgorithmName || newPipelineName;

      const dataKey = urlRestData.slice(0, -1); // Remove 's' from 'algorithms'/'pipelines' -> 'algorithm'/'pipeline'
      const itemType = dataKey.charAt(0).toUpperCase() + dataKey.slice(1); // Capitalize first letter

      const newData = {
        ...selectedRecord[dataKey],
        name: newName,
        version: undefined,
        created: undefined,
        modified: undefined,
      };

      client
        .post(`/store/${urlRestData}`, newData)
        .then(() => {
          notification({
            message: `${itemType} "${newName}" created successfully!`,
            type: 'success',
          });
        })
        .catch(errorNotification);
    },
    [dataSource, urlRestData]
  );

  useEffect(() => {
    if (isFetch) {
      fetch();
    }
  }, [nameId, fetch, isFetch]);

  return {
    dataSource,
    onApply: applyVersion,
    onDelete: deleteVersion,
    onSaveAs: saveAsVersion,
    fetch,
  };
};

export default useVersions;
