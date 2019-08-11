import { useSelector } from 'react-redux';
import { STATE_SOURCES } from 'reducers/root.reducer';
import { useState, useEffect, useRef } from 'react';
import { setLSItem, getLSItem } from 'utils/localStorage';
import LOCAL_STORAGE_KEYS from 'constants/local-storage';

const getTimestamps = dataSource => dataSource.map(data => data.timestamp);

const countAboveMax = (dataSource, lastMax) =>
  getTimestamps(dataSource).reduce((total, curr) => total + (curr > lastMax ? 1 : 0), 0);

const getMaxTimestamp = dataSource =>
  getTimestamps(dataSource).reduce((max, curr) => (curr > max ? curr : max), 0);

const lastTimestampInitial = Number(getLSItem(LOCAL_STORAGE_KEYS.LAST_WARNING_TIMESTAMP) || 0);

export default function useErrorLogs() {
  const dataSource = useSelector(state => state[STATE_SOURCES.ERROR_LOGS_TABLE].dataSource);
  const [isCleared, setIsCleared] = useState(false);
  const lastTimeStamp = useRef(lastTimestampInitial);
  const [totalNewWarnings, setTotalNewWarnings] = useState(0);

  useEffect(
    () => {
      const currNewWarnings = countAboveMax(dataSource, lastTimeStamp.current);
      setTotalNewWarnings(currNewWarnings);
    },
    [dataSource]
  );

  useEffect(
    () => {
      const maxTimestamp = getMaxTimestamp(dataSource);
      if (isCleared) {
        lastTimeStamp.current = maxTimestamp;
        setLSItem(LOCAL_STORAGE_KEYS.LAST_WARNING_TIMESTAMP, lastTimeStamp.current);
        setIsCleared(false);
      }
    },
    [dataSource, isCleared]
  );

  return {
    dataSource,
    totalNewWarnings,
    setIsCleared
  };
}
