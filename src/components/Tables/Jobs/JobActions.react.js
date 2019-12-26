import { Button, Tooltip } from 'antd';
import { FlexBox } from 'components/common';
import { DRAWER_SIZE, PIPELINE_STATES, USER_GUIDE } from 'const';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import JobInfo from './JobInfo.react';

const ActiveState = [
  PIPELINE_STATES.PENDING,
  PIPELINE_STATES.ACTIVE,
  PIPELINE_STATES.RECOVERING,
  PIPELINE_STATES.RESUMING,
];

const isActive = state => ActiveState.includes(state);
const canPauseOrStop = state => isActive(state) || state === PIPELINE_STATES.PAUSED;

const JobActions = ({ job, className }) => {
  const { key, pipeline, status, results } = job;
  const { rerunRawPipeline, stopPipeline, downloadStorageResults, drawerOpen } = useActions();

  const onReRun = () => rerunRawPipeline(pipeline);
  const onStop = () => stopPipeline(key);
  const onDownload = () => downloadStorageResults(results.data.storageInfo.path);

  const body = <JobInfo job={job} />;

  const onMoreInfo = () => {
    drawerOpen({ title: pipeline.name, body, width: DRAWER_SIZE.JOB_INFO });
  };

  const isDownloadDisabled = !(results && results.data && results.data.storageInfo);

  return (
    <div className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
      <FlexBox.Auto justify="center" className={className}>
        <Tooltip placement="top" title="Re-Run">
          <Button type="default" shape="circle" icon="redo" onClick={onReRun} />
        </Tooltip>
        <Tooltip placement="top" title="Stop Pipeline">
          <Button
            type="danger"
            disabled={!canPauseOrStop(status.status)}
            shape="circle"
            icon="close"
            onClick={onStop}
          />
        </Tooltip>
        <Tooltip placement="top" title="Download Results">
          <Button
            type="default"
            disabled={isDownloadDisabled}
            shape="circle"
            icon="download"
            onClick={onDownload}
          />
        </Tooltip>
        <Tooltip placement="top" title="More Info">
          <Button type="default" shape="circle" icon="ellipsis" onClick={onMoreInfo} />
        </Tooltip>
      </FlexBox.Auto>
    </div>
  );
};

JobActions.propTypes = {
  className: PropTypes.string.isRequired,
  job: PropTypes.object.isRequired,
};

export default JobActions;
