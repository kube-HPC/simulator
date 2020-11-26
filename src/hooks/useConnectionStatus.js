// import { useEffect } from 'react';
import {
  shallowEqual,
  // useDispatch,
  useSelector,
} from 'react-redux';

// import { setConnectionStatus } from 'actions/connection.action';
import { STATE_SOURCES } from 'const';

// const isDispatchedOnce = false;

export default function useConnectionStatus() {
  const { isDataAvailable, isSocketConnected } = useSelector(
    state => state[STATE_SOURCES.CONNECTION_STATUS],
    shallowEqual
  );

  // const dispatch = useDispatch();

  // // Connections status defined only by jobs table for now.
  // const dataSource = useSelector(
  //   state => state[STATE_SOURCES.JOBS_TABLE].dataSource
  // );

  // useEffect(() => {
  // if (!isDispatchedOnce && dataSource) {
  //   isDispatchedOnce = true;
  //   dispatch(
  //     setConnectionStatus({ isDataAvailable: true, isSocketConnected })
  //   );
  // }
  // }, [dataSource, dispatch, isSocketConnected]);

  return { isDataAvailable, isSocketConnected };
}
