import { useState, useCallback } from 'react';
import { ERROR_LOG_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { useQuery } from '@apollo/client';

import { setLsItem, getLsItem } from 'utils/localStorage';
import LOCAL_STORAGE_KEYS from 'const/local-storage';

const countAboveMax = (logs, lastMax) =>
  logs.reduce(
    (total, { timestamp }) => total + (timestamp > lastMax ? 1 : 0),
    0
  );

const initialCounter = Number(
  getLsItem(LOCAL_STORAGE_KEYS.LAST_WARNING_TIMESTAMP) || 0
);

const useErrorLogs = () => {
  const query = useQuery(ERROR_LOG_QUERY);
  usePolling(query, 12000);
  const dataSource = query?.data?.errorLogs || [];

  const [lastTimeStamp, setLastTimeStamp] = useState(initialCounter);

  const totalNewWarnings = countAboveMax(dataSource, lastTimeStamp);

  const clearCounter = useCallback(() => {
    const nextTimeStamp = new Date().getTime();
    setLastTimeStamp(nextTimeStamp);
    setLsItem(LOCAL_STORAGE_KEYS.LAST_WARNING_TIMESTAMP, nextTimeStamp);
  }, [setLastTimeStamp]);

  return {
    dataSource,
    totalNewWarnings,
    clearCounter,
  };
};
export default useErrorLogs;
