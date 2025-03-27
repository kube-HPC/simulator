import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import {
  PauseOutlined,
  CaretRightOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  RedoOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';

import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import usePath from './usePath';
import { fetchDownload } from '../../../keycloak/fetchDownload';

const activeStates = [
  PIPELINE_STATUS.PENDING,
  PIPELINE_STATUS.ACTIVE,
  PIPELINE_STATUS.RESUMED,
];

const isActive = state => activeStates.includes(state);
const canPauseOrStop = state =>
  isActive(state) || state === PIPELINE_STATUS.PAUSED;

const JobActions = ({ job }) => {
  const { socketUrl } = useSelector(selectors.connection);
  const { goTo } = usePath();
  const {
    key,
    status: { status },
    results,
  } = job;

  const { rerunPipeline } = usePipeline();
  const { stopPipeline, pausePipeline, resumePipeline } = useActions();

  const onReRun = useCallback(() => rerunPipeline(key), [rerunPipeline, key]);

  const onStop = useCallback(() => stopPipeline(key), [stopPipeline, key]);

  const onMoreInfo = useCallback(
    () => goTo.overview({ nextJobId: key }),
    [goTo, key]
  );

  const downloadNameFile = useMemo(
    () =>
      `${job.pipeline.name}_${job.key}_${new Date(
        +job.pipeline.startTime
      ).toISOString()}.zip`,
    [job.key, job.pipeline.name, job.pipeline.startTime]
  );

  const canPause = useMemo(() => isActive(status), [status]);

  const onPause = useCallback(() => {
    canPause ? pausePipeline(key) : resumePipeline(key);
  }, [canPause, pausePipeline, key, resumePipeline]);
  const isStopDisabled = useMemo(() => !canPauseOrStop(status), [status]);
  const isJobStreaming = useMemo(
    () => job?.pipeline?.kind === 'stream',
    [job?.pipeline?.kind]
  );
  const isDownloadDisabled = !results?.data?.storageInfo;

  /* const handleDownload = useCallback(
    () => downloadLinkRef.current?.click(),
    [downloadLinkRef]
  ); */

  return (
    <Button.Group className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
      <Tooltip
        title="re-run pipeline"
        mouseEnterDelay="0.5"
        mouseLeaveDelay="0">
        <Button icon={<RedoOutlined />} onClick={onReRun} />
      </Tooltip>
      <Tooltip title="stop" mouseEnterDelay="0.5" mouseLeaveDelay="0">
        <Button
          type="danger"
          disabled={isStopDisabled}
          icon={<StopOutlined />}
          onClick={onStop}
        />
      </Tooltip>
      <Tooltip
        title={canPause ? 'pause' : 'resume'}
        mouseEnterDelay="0.5"
        mouseLeaveDelay="0">
        <Button
          disabled={isStopDisabled || isJobStreaming}
          icon={canPause ? <PauseOutlined /> : <CaretRightOutlined />}
          onClick={onPause}
        />
      </Tooltip>
      <Tooltip
        title="download results"
        mouseEnterDelay="0.5"
        mouseLeaveDelay="0">
        <Button
          disabled={isDownloadDisabled}
          icon={<DownloadOutlined />}
          onClick={() =>
            fetchDownload(
              `${socketUrl}/storage/download/pipeline/result/${key}/${downloadNameFile}`
            )
          }
        />
      </Tooltip>
      <Tooltip title="show overview" mouseEnterDelay="0.5" mouseLeaveDelay="0">
        <Button onClick={onMoreInfo} icon={<InfoCircleOutlined />} />
      </Tooltip>
    </Button.Group>
  );
};

JobActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  job: PropTypes.object.isRequired,
};

export default React.memo(JobActions);
