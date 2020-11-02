import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { USER_GUIDE, STATE_SOURCES } from 'const';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import usePath from './usePath';

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
  const { goTo } = usePath();
  const {
    key,
    pipeline,
    status: { status },
    results,
  } = job;

  const {
    rerunRawPipeline,
    stopPipeline,
    pausePipeline,
    resumePipeline,
  } = useActions();

  const onReRun = () => rerunRawPipeline(pipeline);
  const onStop = () => stopPipeline(key);

  const onMoreInfo = () => goTo.overview({ nextJobId: key });

  const isDownloadDisabled = !(
    results &&
    results.data &&
    results.data.storageInfo
  );

  const onPause = useCallback(() => {
    canPause(status) ? pausePipeline(key) : resumePipeline(key);
  }, [status, pausePipeline, key, resumePipeline]);

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
        onClick={onPause}
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
  // TODO: detail the props
  // eslint-disable-next-line
  job: PropTypes.object.isRequired,
};

JobActions.defaultProps = {
  className: '',
};

export default JobActions;