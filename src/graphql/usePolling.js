// eslint-disable no-console

import { useEffect } from 'react';
import { throttle } from 'lodash';
import { inactiveModeVar } from 'cache';

const queryMap = new Map();
let lastActivityTs = Date.now();
let isPolling = true;

const INACTIVE_CHECK_MS =
  Number(import.meta.env.VITE_INACTIVE_CHECK_MS) || 300000; // 5 minutes
const RESUME_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
];

const trackActivity = throttle(() => {
  lastActivityTs = Date.now();
}, 1000);

const stopAllQueries = () => {
  queryMap.forEach((_, query) => {
    query.stopPolling();
  });
};

const startAllQueries = () => {
  queryMap.forEach((interval, query) => {
    query.startPolling(interval);
  });
};

const markActivity = () => {
  lastActivityTs = Date.now();
  if (!isPolling) {
    startAllQueries();
    isPolling = true;
    inactiveModeVar(false);
    RESUME_EVENTS.forEach(eventName => {
      document.removeEventListener(eventName, markActivity);
    });
    document.addEventListener('mousemove', trackActivity, { passive: true });
  }
};

document.addEventListener('mousemove', trackActivity, { passive: true });

// reload all data in site
// eslint-disable-next-line no-unused-vars
export const forceRefetchAll = (act = 'def') => {
  queryMap.forEach((_, query) => {
    if (query.refetch) {
      query.refetch();
    }
  });
};

const activityCheck = () => {
  setTimeout(() => {
    const inactiveForMs = Date.now() - lastActivityTs;

    if (isPolling && inactiveForMs >= INACTIVE_CHECK_MS) {
      stopAllQueries();
      if (isPolling) {
        inactiveModeVar(true);
        isPolling = false;
        document.removeEventListener('mousemove', trackActivity);
        RESUME_EVENTS.forEach(eventName => {
          document.addEventListener(eventName, markActivity, { passive: true });
        });
      }
    }
    activityCheck();
  }, INACTIVE_CHECK_MS); // counter of "Inactive Mode"
};

const usePolling = (query, interval) => {
  useEffect(() => {
    if (!query) return undefined;

    queryMap.set(query, interval);

    if (isPolling) {
      query.startPolling(interval);
    }

    return () => {
      queryMap.delete(query);
      if (query.stopPolling) {
        query.stopPolling();
      }
    };
  }, [query, interval]);
};

activityCheck();

export default usePolling;
