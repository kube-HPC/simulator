import { InMemoryCache, makeVar } from '@apollo/client';
import _ from 'lodash';

export const filterToggeledVar = makeVar(false);
export const inactiveModeVar = makeVar(false);
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        jobsAggregated: {
          keyArgs: ['type'],
          // eslint-skip-next-line
          merge(existing = { jobs: [], cursor: '' }, incoming, { args }) {
            // the  cursor remove was done to avoid uncorrect equality since the cursor is a unneeded field for the query
            const { cursor, ...rest } = args;
            if (!_.isEqual(rest, existing?.query)) {
              // if is not equal then it means that the existing value is not relevant anymore
              // eslint-disable-next-line
              existing = { jobs: [], cursor: '' };
            }
            const merged = {
              cursor: incoming.cursor,
              query: rest,
              jobs: _.unionBy(
                Object.values(existing?.jobs),
                Object.values(incoming?.jobs),
                'key'
              ).sort((a, b) =>
                a.pipeline.startTime > b.pipeline.startTime ? -1 : 1
              ),
            };
            Object.values(merged.jobs).forEach((a, i) => {
              if (Object.values(incoming.jobs).find(b => b.key === a.key)) {
                merged.jobs[i] = Object.values(incoming.jobs).find(
                  b => b.key === a.key
                );
              }
            });
            return merged;
          },
        },
        toggleFilter: {
          read() {
            return filterToggeledVar();
          },
        },
        inactiveMode: {
          read() {
            return inactiveModeVar();
          },
        },
      },
    },
  },
});

export default cache;
