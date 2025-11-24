import { InMemoryCache, makeVar } from '@apollo/client';
import _ from 'lodash';
import dayjs from 'dayjs';
import { LOCAL_STORAGE_KEYS } from 'const';

const defTimeFromLocalStorage =
  parseInt(
    window.localStorage.getItem(LOCAL_STORAGE_KEYS.LOCAL_STORAGE_KEY_TIME),
    10
  ) || 24;

export const dateTimeDefaultVar = makeVar({
  hour: defTimeFromLocalStorage,
  time: dayjs().add(-defTimeFromLocalStorage, 'hour'),
});

export const pipelineJustStartedVar = makeVar(false);

export const numberErrorGraphQLVar = makeVar({ error: 0 });
export const isPinActiveJobVar = makeVar(false);
export const filterToggeledVar = makeVar(true);
export const pipelineListVar = makeVar([]);
export const algorithmsListVar = makeVar([]);
export const inactiveModeVar = makeVar(false);
export const instanceCounterVar = makeVar({
  jobs: 0,
  jobsActive: 0,
  jobsFiltered: 0,
  pipelines: 0,
  algorithms: 0,
  algorithmsUnscheduledReason: 0,
  drivers: 0,
  workers: 0,
  dataSources: 0,
  queue: 0,
});
export const instanceFiltersVar = makeVar({
  jobs: {
    limit: null,
    pipelineName: null,
    algorithmName: null,
    pipelineStatus: null,
    user: null,
    tag: null,
    datesRange: { from: null, to: null },
  },
  pipelines: {
    qPipelineName: null,
  },
  algorithms: {
    qAlgorithmName: null,
  },
});
export const metaVar = makeVar({
  experimentName: 'main',
});

const cache = new InMemoryCache({
  addTypename: false,
  typePolicies: {
    Query: {
      fields: {
        jobsAggregated: {
          keyArgs: ['limit', 'type'],
          // eslint-skip-next-line
          merge(existingData, incoming, { args }) {
            let existing = existingData || { jobs: [], cursor: '' }; // default value for existing
            if (args.limit === 100000) {
              // total jobs
              instanceCounterVar({
                ...instanceCounterVar(),
                jobs: incoming?.jobs?.length || 0,
              });
            }

            if (args.limit === 200000) {
              // active jobs
              instanceCounterVar({
                ...instanceCounterVar(),
                jobsActive: incoming?.jobs?.length || 0,
              });
            }

            if (args.limit < 100000) {
              // scroll jobs
              // the cursor remove was done to avoid uncorrect equality since the cursor is an unneeded field for the query
              const { cursor, ...rest } = args;

              if (!_.isEqual(rest, existing?.query)) {
                // if it's not equal then it means that the existing value is not relevant anymore
                // eslint-disable-next-line
                existing = { jobs: [], cursor: '' };
              }

              const merged = {
                cursor: incoming.cursor,
                query: rest,
                jobs: incoming?.jobs,
              };

              return merged;
            }

            return incoming.jobs;
          },
        },
        toggleFilter: {
          read() {
            return filterToggeledVar();
          },
        },
        isPinActiveJobs: {
          read() {
            return isPinActiveJobVar();
          },
        },
        numberErrorGraphQLVar: {
          read() {
            return numberErrorGraphQLVar();
          },
        },
        instanceFilters: {
          read() {
            return instanceFiltersVar();
          },
        },
        inactiveMode: {
          read() {
            return inactiveModeVar();
          },
        },

        metaMode: {
          read() {
            return metaVar();
          },
        },

        /* algorithms: {
           // eslint-disable-next-line no-unused-vars
           merge(_existing = { algorithms: [] }, incoming) {
             instanceCounterVar({
               ...instanceCounterVar(),
               algorithms:
                 incoming?.list?.length || incoming?.algorithmsCount || 0,
             });
             return incoming;
           },
         }, */
        /*  pipelines: {
            // eslint-disable-next-line no-unused-vars
            merge(_existing = { pipelines: [] }, incoming) {
              instanceCounterVar({
                ...instanceCounterVar(),
                pipelines:
                  incoming?.list?.length || incoming?.pipelinesCount || 0,
              });
              return incoming;
            },
          }, */
        /*   dataSources: {
             // eslint-disable-next-line no-unused-vars
             merge(_existing = { dataSources: [] }, incoming) {
               instanceCounterVar({
                 ...instanceCounterVar(),
                 dataSources:
                   incoming?.list?.length || incoming?.dataSourcesCount || 0,
               });
               return incoming;
             },
           }, */
        //  discovery: {
        // eslint-disable-next-line no-unused-vars
        //    merge(_existing = { pipelineDriver: [], worker: [] }, incoming) {
        //      instanceCounterVar({
        //        ...instanceCounterVar(),
        //  drivers: incoming?.pipelineDriver?.length,
        //  workers: incoming?.worker?.length,
        //     });
        //      return incoming;
        //    },
        // },
        queueCount: {
          merge(_existing, incoming) {
            // const existing = _existing || { queueCount: [] };
            instanceCounterVar({
              ...instanceCounterVar(),
              queue: incoming.managed + incoming.preferred,
            });
            return incoming;
          },
        },
      },
    },
  },
});

export default cache;
