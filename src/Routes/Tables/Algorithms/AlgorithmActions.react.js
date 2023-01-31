import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import {
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

import { Button, Modal, Popover, Typography, Tooltip } from 'antd';
import { useActions } from 'hooks';
import RunForm from './RunForm';
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

const overlayStyle = { width: `50ch` };

const AlgorithmActions = ({ record }) => {
  const { goTo } = usePath();
  const { builds, ...algorithm } = record;
  const { name } = algorithm;

  const { /* applyAlgorithm , */ deleteAlgorithm, runAlgorithm } = useActions();
  const container = useRef();

  // const [inputs, setInputs] = useState(EMPTY_INITIAL);

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

  const onRun = useCallback(input => runAlgorithm({ name, input }), [
    runAlgorithm,
    name,
  ]);

  const onDebug = useCallback(
    input => runAlgorithm({ name, input, debug: true }),
    [runAlgorithm, name]
  );

  const popOverContentRun = <RunForm onRun={onRun} buttonTitle="Run" />;
  const popOverContentDebug = <RunForm onRun={onDebug} buttonTitle="Debug" />;

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
          title="Run Algorithm"
          placement="leftBottom"
          content={popOverContentRun}
          getPopupContainer={setPopupContainer}
          mouseLeaveDelay={0.5}
          mouseEnterDelay={0.5}>
          <Button icon={<PlayCircleOutlined />} onClick={() => onRun()} />
        </Popover>
        <Popover
          overlayStyle={overlayStyle}
          title="Debug Algorithm"
          placement="leftBottom"
          content={popOverContentDebug}
          getPopupContainer={setPopupContainer}
          mouseLeaveDelay={0.5}
          mouseEnterDelay={0.5}>
          <Button icon={<BugOutlined />} onClick={() => onDebug()} />
        </Popover>
        <Tooltip title="edit algorithm">
          <Button icon={<EditOutlined />} onClick={onEdit} />
        </Tooltip>
        <Tooltip title="delete algorithm">
          <Button icon={<DeleteOutlined />} onClick={onClickDelete} />
        </Tooltip>
        <Tooltip title="show overview">
          <Button icon={<InfoCircleOutlined />} onClick={onMoreInfo} />
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
