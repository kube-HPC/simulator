// eslint-disable no-console

import { useEffect } from 'react';
import { throttle } from 'lodash';
import { inactiveModeVar } from 'cache';

const queryArry = [];
let isTrottle = false;
let isPolling = true;

const _throttled = throttle(
  () => {
    isTrottle = true;
  },
  1800,
  { trailing: false }
);

document.addEventListener('mousemove', _throttled);

// reload all data in site
export const forceRefetchAll = () => {
  queryArry.forEach(query => {
    if (query.refetch) {
      query.refetch();
    }
  });
};

const trottleCheck = () => {
  setTimeout(() => {
    if (!isTrottle) {
      queryArry.forEach(query => {
        query.stopPolling();
      });
      if (isPolling) {
        inactiveModeVar(true);
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
      }
    }
    trottleCheck();
  }, 300000); // counter of "Inactive Mode"
};

const usePolling = (query, interval) => {
  useEffect(() => {
    queryArry.push(query);
    query.startPolling(interval);

    return () => {
      queryArry.splice(queryArry.indexOf(query), 1);
      query.stopPolling();
    };
  }, [query, interval]);
};

trottleCheck();

export default usePolling;
