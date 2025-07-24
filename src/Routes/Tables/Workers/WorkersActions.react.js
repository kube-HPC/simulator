import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';
import { message, Button, Tooltip, Popconfirm } from 'antd';

import { useActions } from 'hooks';
import isEqual from 'lodash/isEqual';

const WorkersActions = ({ algorithm, stopAllWorkers = [] }) => {
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

  const onStopAllSuccess = () => {
    setStopWorkerIsRun(true);
    message.success(
      <>
        All Stop workers is started. It may take a few moments for the
        algorithms to be deleted.
      </>
    );
  };

  const handelStop = useCallback(() => {
    if (stopAllWorkers?.length > 0) {
      const stopPromises = stopAllWorkers.map(
        algorithmName =>
          new Promise(resolve => {
            stopAlgorithm(algorithmName, resolve);
          })
      );
      Promise.all(stopPromises).then(onStopAllSuccess);
    } else if (algorithm) {
      stopAlgorithm(algorithm.algorithmName, onStopSuccess);
    }
  }, [algorithm, stopAlgorithm, stopAllWorkers]);

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
        <Tooltip
          title={
            stopAllWorkers?.length > 0 ? 'stop all workers' : 'stop worker'
          }>
          <Popconfirm
            title={
              stopAllWorkers?.length > 0
                ? 'Are you sure you want to stop all workers?'
                : `Are you sure you want to stop "${algorithm?.algorithmName}" worker ?`
            }
            onConfirm={handelStop}
            okText="Yes"
            cancelText="No">
            <Button
              icon={
                stopAllWorkers?.length > 0 ? (
                  ''
                ) : algorithm ? (
                  <StopOutlined />
                ) : (
                  ''
                )
              }
              loading={stopWorkerIsRun}
              styles={{ paddingLeft: '10' }}>
              {stopAllWorkers?.length > 0 ? 'Stop all workers' : ''}
            </Button>
          </Popconfirm>
        </Tooltip>
      </Button.Group>
    </div>
  );
};

WorkersActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  algorithm: PropTypes.object.isRequired,
  stopAllWorkers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const equalStopAllWorkers = ({ stopAllWorkers: a }, { stopAllWorkers: b }) =>
  isEqual(a, b);
const equalAlgorithm = ({ algorithm: a }, { algorithm: b }) => isEqual(a, b);

export default memo(WorkersActions, equalAlgorithm && equalStopAllWorkers);
