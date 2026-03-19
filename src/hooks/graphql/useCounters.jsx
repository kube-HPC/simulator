import { COUNTERS_QUERY } from 'graphql/queries';
import { usePolling } from 'hooks';
import { events } from 'utils';
import { Button } from 'antd';
import React, { useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  instanceFiltersVar,
  instanceCounterVar,
  dateTimeDefaultVar,
  pipelineJustStartedVar,
  metaVar,
  queueClearedVar,
} from 'cache';

const ButtonLinkStyle = styled(Button)`
  padding: 0px;
`;

const useCounters = () => {
  const navigate = useNavigate();
  const instanceFilters = useReactiveVar(instanceFiltersVar);
  const dateTimeDefault = useReactiveVar(dateTimeDefaultVar);
  const queueCleared = useReactiveVar(queueClearedVar);
  const pipelineJustStarted = useReactiveVar(pipelineJustStartedVar);
  const metaMode = useReactiveVar(metaVar);
  const prevQueueCountRef = useRef(null);
  const prevJobsCountRef = useRef(null);

  const mergedParams = useMemo(() => {
    const iJobs = instanceFilters.jobs;

    const items = {
      algorithmName: iJobs?.algorithmName || undefined,
      pipelineName: iJobs?.pipelineName || undefined,
      pipelineStatus: iJobs?.pipelineStatus || undefined,
      user: iJobs?.user || undefined,
      tag: iJobs?.tag || undefined,
      datesRange: {
        from: iJobs?.datesRange?.from || dateTimeDefault.time,
        to: iJobs?.datesRange?.to || null,
      },
    };

    if (
      metaMode?.experimentName != null &&
      metaMode?.experimentName !== 'show-all'
    ) {
      items.experimentName = metaMode.experimentName;
    } else {
      items.experimentName = undefined;
    }

    return items;
  }, [
    instanceFilters.jobs?.algorithmName,
    instanceFilters.jobs?.pipelineName,
    instanceFilters.jobs?.pipelineStatus,
    instanceFilters.jobs?.user,
    instanceFilters.jobs?.tag,
    instanceFilters.jobs?.datesRange?.from,
    instanceFilters.jobs?.datesRange?.to,
    metaMode?.experimentName,
    dateTimeDefault.time,
  ]);

  const [counters, setCounters] = React.useState({
    jobs: 0,
    pipelines: 0,
    algorithms: 0,
    algorithmsUnscheduledReason: 0,
    queue: 0,
    dataSources: 0,
    drivers: 0,
    workers: 0,
  });

  const gotoJobsTable = useCallback(() => {
    navigate('/jobs');
  }, [navigate]);

  const query = useQuery(COUNTERS_QUERY, {
    variables: mergedParams,
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const newCounters = {
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

      setCounters(newCounters);

      // --- queue increased: a new job was added ---
      if (
        prevQueueCountRef.current !== null &&
        newCounters.queue > prevQueueCountRef.current
      ) {
        events.emit(
          'global_alert_msg',
          'A new job has been added to the queue',
          'info'
        );
      }

      // --- queue decreased ---
      if (
        prevQueueCountRef.current !== null &&
        newCounters.queue < prevQueueCountRef.current
      ) {
        if (queueCleared) {
          // manual stop/clear — notification already emitted by the action component
          // also clear pipelineJustStarted to prevent a false "Pipeline started" message
          queueClearedVar(false);
          pipelineJustStartedVar(false);
        } else {
          // organic: jobs graduated from queue to running
          const jobsStarted = prevQueueCountRef.current - newCounters.queue;
          events.emit(
            'global_alert_msg',
            <>
              {jobsStarted} {jobsStarted === 1 ? 'job' : 'jobs'} started from
              queue, see{' '}
              <ButtonLinkStyle type="link" onClick={gotoJobsTable}>
                jobs
              </ButtonLinkStyle>
            </>,
            'success'
          );
        }
      }

      prevQueueCountRef.current = newCounters.queue;

      // --- jobs count increased: pipeline was manually started ---
      // guard with !queueCleared to prevent false "Pipeline started" during a stop
      if (
        prevJobsCountRef.current !== null &&
        newCounters.jobs > prevJobsCountRef.current &&
        pipelineJustStarted &&
        !queueCleared
      ) {
        events.emit(
          'global_alert_msg',
          <>
            Pipeline started, see{' '}
            <ButtonLinkStyle type="link" onClick={gotoJobsTable}>
              jobs
            </ButtonLinkStyle>
          </>,
          'success'
        );

        pipelineJustStartedVar(false);
      }

      prevJobsCountRef.current = newCounters.jobs;

      instanceCounterVar({
        ...instanceCounterVar(),
        ...newCounters,
      });
    },
  });

  usePolling(query, 3000);
};

export default useCounters;
