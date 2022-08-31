import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { createStore } from 'reusable';
import { setLsItem, getLsItem } from 'utils/localStorage';
import LOCAL_STORAGE_KEYS from 'const/local-storage';
import { selectors } from 'reducers';
// import { usePolling } from 'hooks';
// import { useQuery } from '@apollo/client';
// import { ALGORITHMS_QUERY } from 'qraphql/queries';

/** @typedef {import('reducers/ErrorLog').ErrorLog} ErrorLog */

/**
 * @param {ErrorLog[]} logs
 * @param {number} lastMax
 */
const countAboveMax = (logs, lastMax) =>
  logs.reduce(
    (total, { timestamp }) => total + (timestamp > lastMax ? 1 : 0),
    0
  );

const initialCounter = Number(
  getLsItem(LOCAL_STORAGE_KEYS.LAST_WARNING_TIMESTAMP) || 0
);

const useErrorLogs = () => {
  const dataSource = useSelector(selectors.errorLogs);
  // const query = useQuery(ALGORITHMS_QUERY);
  // usePolling(query, 10000);
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

export default createStore(useErrorLogs);
