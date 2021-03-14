import { pipelineStatuses as PIPELINE_STATUS } from '@hkube/consts';
import { Button, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { USER_GUIDE } from 'const';
import { useActions, usePipeline } from 'hooks';

import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef } from 'react';
import usePath from './usePath';

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
    userPipeline,
    status: { status },
    results,
  } = job;

  const { rerunRawPipeline } = usePipeline();
  const { stopPipeline, pausePipeline, resumePipeline } = useActions();
  const downloadLinkRef = useRef();
  const onReRun = useCallback(() => rerunRawPipeline(userPipeline, key), [
    userPipeline,
    rerunRawPipeline,
    key,
  ]);

  const onStop = useCallback(() => stopPipeline(key), [stopPipeline, key]);

  const onMoreInfo = useCallback(() => goTo.overview({ nextJobId: key }), [
    goTo,
    key,
  ]);

  const canPause = useMemo(() => isActive(status), [status]);

  const onPause = useCallback(() => {
    canPause ? pausePipeline(key) : resumePipeline(key);
  }, [canPause, pausePipeline, key, resumePipeline]);
  const isStopDisabled = useMemo(() => !canPauseOrStop(status), [status]);

  const isDownloadDisabled = !results?.data?.storageInfo;
  const handleDownload = useCallback(
    () => downloadLinkRef.current && downloadLinkRef.current?.click(),
    [downloadLinkRef]
  );
  return (
    <>
      <Button.Group className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
        <Tooltip title="re-run pipeline">
          <Button icon="redo" onClick={onReRun} />
        </Tooltip>
        <Tooltip title="stop">
          <Button
            type="danger"
            disabled={isStopDisabled}
            icon="stop"
            onClick={onStop}
          />
        </Tooltip>
        <Tooltip title={canPause ? 'pause' : 'resume'}>
          <Button
            disabled={isStopDisabled}
            icon={canPause ? 'pause' : 'caret-right'}
            onClick={onPause}
          />
        </Tooltip>
        <Tooltip title="download results">
          <Button
            disabled={isDownloadDisabled}
            icon="download"
            onClick={handleDownload}
          />
        </Tooltip>
        <Tooltip title="show overview">
          <Button onClick={onMoreInfo} icon="info-circle" />
        </Tooltip>
      </Button.Group>
      <a
        style={{ display: 'none' }}
        ref={downloadLinkRef}
        href={`${socketUrl}/storage/download/pipeline/result/${key}`}
        download>
        hidden download link
      </a>
    </>
  );
};

JobActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  job: PropTypes.object.isRequired,
};

JobActions.defaultProps = {};

export default React.memo(JobActions);
