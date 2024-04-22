import React, { memo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { StopOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useActions } from 'hooks';
import isEqual from 'lodash/isEqual';

const WorkersActions = ({ algorithm }) => {
  const { stopAlgorithm } = useActions();
  const container = useRef();
  const onStop = useCallback(() => stopAlgorithm(algorithm.algorithmName), [
    algorithm,
  ]);

  const stopPropagation = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <div
      role="none"
      ref={container}
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}>
      <Button.Group>
        <Tooltip title="stop worker">
          <Button icon={<StopOutlined />} onClick={onStop} />
        </Tooltip>
      </Button.Group>
    </div>
  );
};

WorkersActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  algorithm: PropTypes.object.isRequired,
  className: PropTypes.string,
};
WorkersActions.defaultProps = {
  className: '',
};

const areEqual = ({ algorithm: a }, { algorithm: b }) => isEqual(a, b);

export default memo(WorkersActions, areEqual);
