import { COUNTERS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { message, Button } from 'antd';
import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  instanceFiltersVar,
  instanceCounterVar,
  dateTimeDefaultVar,
  pipelineJustStartedVar,
} from 'cache';

const ButtonLinkStyle = styled(Button)`
  padding: 0px;
`;

const useCounters = () => {
  const navigate = useNavigate();
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const dateTimeDefault = useReactiveVar(dateTimeDefaultVar);
  const pipelineJustStarted = useReactiveVar(pipelineJustStartedVar);
  let counters = null;
  const prevQueueCountRef = useRef(null);
  const prevJobsCountRef = useRef(null);

  const gotoJobsTable = useCallback(() => {
    navigate('/jobs');
  }, [navigate]);

  const query = useQuery(COUNTERS_QUERY, {
    variables: {
      datesRange: {
        from: instanceFilters?.jobs?.datesRange?.from || dateTimeDefault.time,
        to: instanceFilters?.jobs?.datesRange?.to || null,
      },
    },
    onCompleted: data => {
      counters = {
        jobs: data?.jobsAggregated?.jobsCount || 0,
        pipelines: data?.pipelines?.pipelinesCount || 0,
        algorithms: data?.algorithms?.algorithmsCount || 0,
        algorithmsUnscheduledReason:
          data?.algorithms?.list.filter(x => x.unscheduledReason != null)
            .length || 0,
        queue:
          (data?.queueCount?.managed || 0) + (data?.queueCount?.preferred || 0),
        dataSources: data?.dataSources?.dataSourcesCount,
        drivers: data.discovery.pipelineDriver.length,
        workers: data.discovery.worker.length,
      };

      if (
        prevQueueCountRef.current !== null &&
        counters.queue > prevQueueCountRef.current
      ) {
        message.info('A new job has been added to the queue');
      }
      prevQueueCountRef.current = counters.queue;

      if (
        prevJobsCountRef.current !== null &&
        counters.jobs > prevJobsCountRef.current &&
        pipelineJustStarted
      ) {
        message.success(
          <>
            Pipeline started, see{' '}
            <ButtonLinkStyle type="link" onClick={gotoJobsTable}>
              jobs
            </ButtonLinkStyle>
          </>
        );
        pipelineJustStartedVar(false); // reset flag
      }
      prevJobsCountRef.current = counters.jobs;

      instanceCounterVar({
        ...instanceCounterVar(),
        ...counters,
      });
    },
  });

  usePolling(query, 3000);
};
export default useCounters;
