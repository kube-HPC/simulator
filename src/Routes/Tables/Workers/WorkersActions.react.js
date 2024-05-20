import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';
import { message, Button, Tooltip } from 'antd';

import { useActions } from 'hooks';
import isEqual from 'lodash/isEqual';

const WorkersActions = ({ algorithm }) => {
  const { stopAlgorithm } = useActions();
  const [stopWorkerIsRun, setStopWorkerIsRun] = useState(false);
  const container = useRef();

  const onStopSuccess = () => {
    setStopWorkerIsRun(true);
    message.success(
      <>
        Stop worker is started. It may take a few moments for the algorithms to
        be deleted.
      </>
    );
  };

  const onStop = useCallback(() => {
    stopAlgorithm(algorithm.algorithmName, onStopSuccess);
  }, [algorithm.algorithmName, stopAlgorithm]);

  const stopPropagation = useCallback(e => {
    e.stopPropagation();
  }, []);

  useEffect(() => {
    if (algorithm?.exit === 0) {
      setStopWorkerIsRun(false);
    }
  }, [algorithm, algorithm?.exit]);

  return (
    <div
      role="none"
      ref={container}
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}>
      <Button.Group>
        <Tooltip title="stop worker">
          <Button
            icon={<StopOutlined />}
            onClick={onStop}
            loading={stopWorkerIsRun}
          />
        </Tooltip>
      </Button.Group>
    </div>
  );
};

WorkersActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  algorithm: PropTypes.object.isRequired,
};

const areEqual = ({ algorithm: a }, { algorithm: b }) => isEqual(a, b);

export default memo(WorkersActions, areEqual);
