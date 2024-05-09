import React, { memo, useCallback, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';
import { message, Button, Tooltip } from 'antd';
import { workersStopListVar } from 'cache';
import { useActions } from 'hooks';
import isEqual from 'lodash/isEqual';
import { useReactiveVar } from '@apollo/client';

const WorkersActions = ({ algorithm }) => {
  const workersStopList = useReactiveVar(workersStopListVar);
  const { stopAlgorithm } = useActions();
  const [stopWorkerIsRun, setStopWorkerIsRun] = useState(false);
  const container = useRef();

  const onStopSuccess = () => {
    const arrWorkersStopList = [...workersStopListVar()];
    const arrWorkersStopListFilter = arrWorkersStopList.filter(
      x => x !== algorithm.algorithmName
    );

    workersStopListVar(arrWorkersStopListFilter);
  };

  const onStop = useCallback(() => {
    message.success(
      <>
        Stop worker is started. It may take a few moments for the algorithms to
        be deleted.
      </>
    );
    const arrWorkersStopList = [...workersStopList];
    arrWorkersStopList.push(algorithm.algorithmName);

    workersStopListVar(arrWorkersStopList);
    stopAlgorithm(algorithm.algorithmName);
    setStopWorkerIsRun(true);
  }, [algorithm.algorithmName, stopAlgorithm, workersStopList]);

  const stopPropagation = useCallback(e => {
    e.stopPropagation();
  }, []);

  useEffect(() => () => onStopSuccess(), []);

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
