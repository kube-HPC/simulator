import { InMemoryCache, makeVar } from '@apollo/client';
import _ from 'lodash';

export const filterToggeledVar = makeVar(false);
export const inactiveModeVar = makeVar(false);
export const instanceCounterVar = makeVar({
  jobs: 0,
  pipelines: 0,
  algorithms: 0,
  drivers: 0,
  workers: 0,
  dataSources: 0,
});
const cache = new InMemoryCache({
  addTypename: false,
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
            instanceCounterVar({
              ...instanceCounterVar(),
              jobs: merged?.jobs?.length,
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
        algorithms: {
          // eslint-disable-next-line no-unused-vars
          merge(_existing = { algorithms: [] }, incoming) {
            instanceCounterVar({
              ...instanceCounterVar(),
              algorithms: incoming.list.length,
            });
            return incoming;
          },
        },
        pipelines: {
          // eslint-disable-next-line no-unused-vars
          merge(_existing = { pipelines: [] }, incoming) {
            instanceCounterVar({
              ...instanceCounterVar(),
              pipelines: incoming.list.length,
            });
            return incoming;
          },
        },
        discovery: {
          // eslint-disable-next-line no-unused-vars
          merge(_existing = { pipelineDriver: [], worker: [] }, incoming) {
            instanceCounterVar({
              ...instanceCounterVar(),
              drivers: incoming?.pipelineDriver?.length,
              workers: incoming?.worker?.length,
            });
            return incoming;
          },
        },
      },
    },
  },
});

export default cache;
