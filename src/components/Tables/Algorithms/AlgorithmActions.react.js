import { Button, Modal, Popover, Typography } from 'antd';
import { useActions, useDrawerEditor } from 'hooks';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import { stringify } from 'utils';
import AlgorithmRun from './AlgorithmRun.react';

const deleteConfirmAction = action => {
  Modal.confirm({
    title: 'Deleting Algorithm',
    content: (
      <>
        Deleting algorithm will <Typography.Text strong>delete all</Typography.Text> related
        pipelines and <Typography.Text strong>stop all</Typography.Text> executions.
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
  /* eslint-disable-next-line no-unused-vars */
  const { builds, ...algorithm } = record;
  const { name } = algorithm;

  const { applyAlgorithm, deleteAlgorithm, runAlgorithm } = useActions();
  const container = useRef();

  const [inputs, setInputs] = useState(EMPTY_INITIAL);

  const setPopupContainer = useCallback(() => container.current, []);

  const onSubmit = useCallback(
    value => {
      const formData = new FormData();
      formData.append('payload', value);
      applyAlgorithm(formData);
    },
    [applyAlgorithm],
  );

  const { open } = useDrawerEditor({ onSubmit });

  const onEdit = () => open(stringify(algorithm));
  const onClickDelete = useCallback(() => deleteConfirmAction(() => deleteAlgorithm(name)), [
    deleteAlgorithm,
    name,
  ]);
  const onRun = () => runAlgorithm({ name, input: inputs });

  const popOverContent = <AlgorithmRun onChange={setInputs} onRun={onRun} />;

  return (
    <div ref={container}>
      <Button.Group>
        <Popover
          overlayStyle={overlayStyle}
          title={title}
          placement="left"
          content={popOverContent}
          getPopupContainer={setPopupContainer}>
          <Button icon="play-circle" onClick={onRun} />
        </Popover>
        <Button icon="edit" onClick={onEdit} />
        <Button shape="circle" icon="delete" onClick={onClickDelete} />
      </Button.Group>
    </div>
  );
};

AlgorithmActions.propTypes = {
  record: PropTypes.object.isRequired,
};

export default AlgorithmActions;
