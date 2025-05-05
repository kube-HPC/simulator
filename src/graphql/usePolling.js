// eslint-disable no-console

import { useEffect } from 'react';
import { throttle } from 'lodash';
import { inactiveModeVar } from 'cache';

const queryArry = [];
let isTrottle = false;
let isPolling = true;

const _throttled = throttle(
  () => {
    // console.log('throttle Inactive Mode');
    isTrottle = true;
  },
  1800,

  { trailing: false }
);

document.addEventListener('mousemove', _throttled);

const trottleCheck = () => {
  setTimeout(() => {
    if (!isTrottle) {
      queryArry.forEach(query => {
        query.stopPolling();
      });
      if (isPolling) {
        // prettier-ignore
        inactiveModeVar(true);
        //  console.log('polling stopped count:', queryArry?.length);
        isPolling = false;
      }
    } else {
      isTrottle = false;
      if (!isPolling) {
        queryArry.forEach(query => {
          query.startPolling(3000);
        });
        isPolling = true;
        inactiveModeVar(false);
        // prettier-ignore
        //  console.log('polling started count:', queryArry?.length);
      }
    }
    trottleCheck();
  }, 300000); // counter of "Inactive Mode"
};

const usePolling = (query, interval) => {
  useEffect(() => {
    const useMock = process.env.REACT_APP_USEMOCK ?? false;

    if (!useMock) {
      queryArry.push(query);
      query.startPolling(interval);
    }
    // prettier-ignore
    // 'polling');
    return () => {
      queryArry.splice(queryArry.indexOf(query), 1);
      query.stopPolling();
      // prettier-ignore
     // console.log('stop polling');
    };
  }, [query, interval]);
};

trottleCheck();

export default usePolling;
