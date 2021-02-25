import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { DRAWER_SIZE, USER_GUIDE, STATE_SOURCES } from 'const';
import { useActions, usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import JobInfo from './JobInfo.react';

const activeStates = [
  PIPELINE_STATUS.PENDING,
  PIPELINE_STATUS.ACTIVE,
  PIPELINE_STATUS.RESUMED,
];

const isActive = state => activeStates.includes(state);
const canPause = state => isActive(state);
const canPauseOrStop = state =>
  isActive(state) || state === PIPELINE_STATUS.PAUSED;

const JobActions = ({ job, className }) => {
  const socketURL = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);
  const {
    key,
    pipeline,
    status: { status },
    results,
  } = job;

  const { rerunRawPipeline } = usePipeline();

  const {
    stopPipeline,
    drawerOpen,
    pausePipeline,
    resumePipeline,
  } = useActions();

  const onReRun = () => rerunRawPipeline(pipeline, key);
  const onStop = () => stopPipeline(key);

  const onMoreInfo = () => {
    const body = <JobInfo jobId={key} />;
    return drawerOpen({
      title: pipeline.name,
      body,
      width: DRAWER_SIZE.JOB_INFO,
    });
  };

  const isDownloadDisabled = !(
    results &&
    results.data &&
    results.data.storageInfo
  );

  return (
    <Button.Group
      className={`${className} ${USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}`}>
      <Button icon="redo" onClick={onReRun} />
      <Button
        type="danger"
        disabled={!canPauseOrStop(status)}
        icon="close"
        onClick={onStop}
      />
      <Button
        disabled={!canPauseOrStop(status)}
        icon={canPause(status) ? 'pause' : 'caret-right'}
        onClick={() =>
          canPause(status) ? pausePipeline(key) : resumePipeline(key)
        }
      />
      <a href={`${socketURL}/storage/download/pipeline/result/${key}`} download>
        <Button disabled={isDownloadDisabled} icon="download" />
      </a>
      <Button icon="ellipsis" onClick={onMoreInfo} />
    </Button.Group>
  );
};

JobActions.propTypes = {
  className: PropTypes.string,
  job: PropTypes.object.isRequired,
};

export default JobActions;
