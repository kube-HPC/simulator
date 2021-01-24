import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Popover, Typography, Tooltip } from 'antd';
import { useActions } from 'hooks';
import AlgorithmRun from './AlgorithmRun.react';
import usePath from './usePath';

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

const overlayStyle = { width: `60ch` };

const AlgorithmActions = ({ record }) => {
  const { goTo } = usePath();
  const { builds, ...algorithm } = record;
  const { name } = algorithm;

  const { /* applyAlgorithm , */ deleteAlgorithm, runAlgorithm } = useActions();
  const container = useRef();

  const [inputs, setInputs] = useState(EMPTY_INITIAL);

  const setPopupContainer = useCallback(() => container.current, []);

  // const onSubmit = useCallback(
  //   value => {
  //     const formData = new FormData();
  //     formData.append('payload', value);
  //     applyAlgorithm(formData);
  //   },
  //   [applyAlgorithm]
  // );

  const onEdit = useCallback(() => goTo.edit({ nextAlgorithmId: name }), [
    goTo,
    name,
  ]);

  const onClickDelete = useCallback(
    () => deleteConfirmAction(() => deleteAlgorithm(name)),
    [deleteAlgorithm, name]
  );

  const onRun = () => runAlgorithm({ name, input: inputs });

  const popOverContent = <AlgorithmRun onChange={setInputs} onRun={onRun} />;

  const onMoreInfo = useCallback(
    () => goTo.overview({ nextAlgorithmId: name }),
    [goTo, name]
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
        <Popover
          overlayStyle={overlayStyle}
          title={title}
          placement="left"
          content={popOverContent}
          getPopupContainer={setPopupContainer}
          mouseLeaveDelay={0.5}>
          <Button icon="play-circle" onClick={onRun} />
        </Popover>
        <Tooltip title="edit algorithm">
          <Button icon="edit" onClick={onEdit} />
        </Tooltip>
        <Tooltip title="delete algorithm">
          <Button icon="delete" onClick={onClickDelete} />
        </Tooltip>
        <Tooltip title="show overview">
          <Button icon="info-circle" onClick={onMoreInfo} />
        </Tooltip>
      </Button.Group>
    </div>
  );
};

AlgorithmActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
};

export default React.memo(AlgorithmActions);
