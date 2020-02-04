import { Button } from 'antd';
import { DRAWER_SIZE, PIPELINE_STATES, USER_GUIDE } from 'const';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import JobInfo from './JobInfo.react';

const ActiveState = [PIPELINE_STATES.PENDING, PIPELINE_STATES.ACTIVE, PIPELINE_STATES.RESUMED];

const isActive = state => ActiveState.includes(state);
const canPauseOrStop = state => isActive(state) || state === PIPELINE_STATES.PAUSED;
const canPause = state => isActive(state);

const JobActions = ({ job, className }) => {
  const {
    key,
    pipeline,
    status: { status },
    results,
  } = job;

  const {
    rerunRawPipeline,
    stopPipeline,
    downloadStorageResults,
    drawerOpen,
    pausePipeline,
    resumePipeline,
  } = useActions();

  const onReRun = () => rerunRawPipeline(pipeline);
  const onStop = () => stopPipeline(key);
  const onDownload = () => downloadStorageResults(results.data.storageInfo.path);

  const onMoreInfo = () => {
    const body = <JobInfo jobId={key} />;
    return drawerOpen({ title: pipeline.name, body, width: DRAWER_SIZE.JOB_INFO });
  };

  const isDownloadDisabled = !(results && results.data && results.data.storageInfo);
  const pauseAndStopIsDisabled = !canPauseOrStop(status);

  return (
    <Button.Group className={`${className} ${USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}`}>
      <Button icon="redo" onClick={onReRun} />
      <Button type="danger" disabled={pauseAndStopIsDisabled} icon="close" onClick={onStop} />
      <Button
        disabled={canPauseOrStop}
        icon={pauseAndStopIsDisabled ? 'pause' : 'caret-right'}
        onClick={() => (canPause(status) ? pausePipeline(key) : resumePipeline(key))}
      />
      <Button disabled={isDownloadDisabled} icon="download" onClick={onDownload} />
      <Button icon="ellipsis" onClick={onMoreInfo} />
    </Button.Group>
  );
};

JobActions.propTypes = {
  className: PropTypes.string,
  job: PropTypes.object.isRequired,
};

export default JobActions;
