import { Button, Modal, Popover, Typography } from 'antd';
import { DRAWER_SIZE } from 'const';
import { useActions, useDrawerEditor } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { stringify } from 'utils';
import AlgorithmRun from './AlgorithmRun.react';
import { AlgorithmsTabs } from './Tabs';

const deleteConfirmAction = action => {
  Modal.confirm({
    title: 'Deleting Algorithm',
    content: (
      <>
        Deleting algorithm will{' '}
        <Typography.Text strong>delete all</Typography.Text> related pipelines
        and <Typography.Text strong>stop all</Typography.Text> executions.
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

const title = `Run Algorithm`;
const EMPTY_INITIAL = [];

const overlayStyle = { width: `500px` };

const AlgorithmActions = ({ record }) => {
  const { builds, ...algorithm } = record;
  const { name } = algorithm;

  const {
    applyAlgorithm,
    deleteAlgorithm,
    runAlgorithm,
    drawerOpen,
  } = useActions();
  const container = useRef();

  const [inputs, setInputs] = useState(EMPTY_INITIAL);

  const setPopupContainer = useCallback(() => container.current, []);

  const onSubmit = useCallback(
    value => {
      const formData = new FormData();
      formData.append('payload', value);
      applyAlgorithm(formData);
    },
    [applyAlgorithm]
  );

  const { open } = useDrawerEditor({ onSubmit });

  const onEdit = () => open(stringify(algorithm));
  const onClickDelete = useCallback(
    () => deleteConfirmAction(() => deleteAlgorithm(name)),
    [deleteAlgorithm, name]
  );
  const onRun = () => runAlgorithm({ name, input: inputs });

  const popOverContent = <AlgorithmRun onChange={setInputs} onRun={onRun} />;

  const onMoreInfo = () => {
    const body = <AlgorithmsTabs name={name} />;
    drawerOpen({ title: name, body, width: DRAWER_SIZE.ALGORITHM_INFO });
  };

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
        <Popover
          overlayStyle={overlayStyle}
          title={title}
          placement="left"
          content={popOverContent}
          getPopupContainer={setPopupContainer}
          mouseLeaveDelay={0.5}>
          <Button icon="play-circle" onClick={onRun} />
        </Popover>
        <Button icon="edit" onClick={onEdit} />
        <Button icon="delete" onClick={onClickDelete} />
        <Button icon="ellipsis" onClick={onMoreInfo} />
      </Button.Group>
    </div>
  );
};

AlgorithmActions.propTypes = {
  record: PropTypes.object.isRequired,
};

export default AlgorithmActions;
