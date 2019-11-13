import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setConnectionStatus } from 'actions/connection.action';
import { STATE_SOURCES } from 'const';

let isDispatchedOnce = false;

export default function useConnectionStatus() {
  const { isDataAvailable, isSocketConnected } = useSelector(
    state => state[STATE_SOURCES.CONNECTION_STATUS],
  );

  const dispatch = useDispatch();

  // Connections status defined only by jobs table for now.
  const dataSource = useSelector(state => state[STATE_SOURCES.JOBS_TABLE].dataSource);

  useEffect(() => {
    if (!isDispatchedOnce && dataSource) {
      isDispatchedOnce = true;
      dispatch(setConnectionStatus({ isDataAvailable: true }));
    }
  }, [dataSource, dispatch]);

  return { isDataAvailable, isSocketConnected };
}
