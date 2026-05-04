// eslint-disable no-console

import { useEffect } from 'react';
import { throttle } from 'lodash';
import { inactiveModeVar } from 'cache';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';

const queryMap = new Map();
let lastActivityTs = Date.now();
let isPolling = true;
let currentInactiveCheckMs = 300000;
let activityTimeoutId = null;
let pollingHookInstances = 0;

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

const activityCheck = (inactiveCheckMs = currentInactiveCheckMs) => {
  activityTimeoutId = setTimeout(() => {
    const inactiveForMs = Date.now() - lastActivityTs;

    if (isPolling && inactiveForMs >= inactiveCheckMs) {
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
    activityCheck(currentInactiveCheckMs);
  }, inactiveCheckMs); // counter of "Inactive Mode"
};

const usePolling = (query, interval) => {
  const { inactiveCheckMs } = useSelector(selectors.connection);

  useEffect(() => {
    pollingHookInstances += 1;

    if (!activityTimeoutId) {
      activityCheck(currentInactiveCheckMs);
    }

    return () => {
      pollingHookInstances -= 1;

      if (pollingHookInstances === 0 && activityTimeoutId) {
        clearTimeout(activityTimeoutId);
        activityTimeoutId = null;
      }
    };
  }, []);

  useEffect(() => {
    currentInactiveCheckMs = Number(inactiveCheckMs) || 300000;

    if (activityTimeoutId) {
      clearTimeout(activityTimeoutId);
      activityTimeoutId = null;
      activityCheck(currentInactiveCheckMs);
    }
  }, [inactiveCheckMs]);

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

export default usePolling;
