import React, { useCallback, useRef, useMemo } from 'react';
import { devenvStatuses } from '@hkube/consts';
import PropTypes from 'prop-types';
import { Button, Modal, Typography, Tooltip } from 'antd';
import { useActions } from 'hooks';

const deleteConfirmAction = action => {
  Modal.confirm({
    title: 'Deleting Devenv',
    content: (
      <>
        Deleting the devenv will{' '}
        <Typography.Text strong>delete all</Typography.Text> environment
        persistent data.
      </>
    ),
    okText: 'Confirm',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      action();
    },
  });
};

const DevenvsActions = ({ record }) => {
  const { ...devenv } = record;
  const { name, status } = devenv;

  const { deleteDevenv, stopDevenv, startDevenv } = useActions();
  const container = useRef();

  const onClickDelete = useCallback(
    () => deleteConfirmAction(() => deleteDevenv(name)),
    [deleteDevenv, name]
  );

  const isRunning = useMemo(
    () =>
      status === devenvStatuses.PENDING || status === devenvStatuses.RUNNING,
    [status]
  );

  const onStartStop = useCallback(
    () => (isRunning ? stopDevenv(name) : startDevenv(name)),
    [startDevenv, stopDevenv, isRunning, name]
  );

  const stopPropagation = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <div
      ref={container}
      role="none"
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}>
      <Button.Group>
        <Tooltip title={isRunning ? 'Stop' : 'Start'}>
          <Button
            icon={isRunning ? 'stop' : 'play-circle'}
            onClick={onStartStop}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button icon="delete" onClick={onClickDelete} />
        </Tooltip>
      </Button.Group>
    </div>
  );
};

DevenvsActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
};

export default React.memo(DevenvsActions);
