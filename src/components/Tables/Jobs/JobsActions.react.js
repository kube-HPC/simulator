import { Button, Tooltip } from 'antd';
import { FlexBox } from 'components/common';
import { PIPELINE_STATES, USER_GUIDE } from 'const';
import { useActions } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';

const ActiveState = [
  PIPELINE_STATES.PENDING,
  PIPELINE_STATES.ACTIVE,
  PIPELINE_STATES.RECOVERING,
  PIPELINE_STATES.RESUMING,
];

const isActive = state => ActiveState.includes(state);
const canPauseOrStop = state => isActive(state) || state === PIPELINE_STATES.PAUSED;

const JobActions = ({ key, pipeline, status, results, className }) => {
  const { rerunRawPipeline, stopPipeline, downloadStorageResults, drawerOpen } = useActions();

  const onReRun = () => rerunRawPipeline(pipeline);
  const onStop = () => stopPipeline(key);
  const onDownload = () => downloadStorageResults(results.data.storageInfo.path);
  const onMoreInfo = () => drawerOpen({ body: 'hello' });

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
            disabled={!canPauseOrStop(status)}
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
  key: PropTypes.string.isRequired,
  pipeline: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

export default JobActions;
