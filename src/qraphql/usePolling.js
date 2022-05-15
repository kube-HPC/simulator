// eslint-disable no-console

import { useEffect } from 'react';
import { throttle } from 'lodash'; // debounce

const queryArry = [];
let isTrottle = false;
let isPolling = true;
// let _debounced = null;
// const _stopPolling = () => {
//   queryArry.forEach(query => {
//     query.stopPolling();

//   })
//   console.log('debounced');
// }
// const _debounced = debounce(() => console.log('debounced'), 20000, { maxWait: 20000 });

const _throttled = throttle(
  () => {
    console.log('throttle');
    isTrottle = true;
  },
  10000,
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
        console.log('polling stopped count:', queryArry?.length);
        isPolling = false;
      }
    } else {
      isTrottle = false;
      if (!isPolling) {
        queryArry.forEach(query => {
          query.startPolling(3000);
        });
        isPolling = true;
        // prettier-ignore
        console.log('polling started count:', queryArry?.length);
      }
    }
    trottleCheck();
  }, 30000);
};

const usePolling = (query, interval) => {
  useEffect(() => {
    queryArry.push(query);
    query.startPolling(interval);
    // prettier-ignore
    console.log('polling');
    return () => {
      queryArry.splice(queryArry.indexOf(query), 1);
      query.stopPolling();
      // prettier-ignore
      console.log('stop polling');
    };
  }, [query, interval]);
};

trottleCheck();

export default usePolling;
