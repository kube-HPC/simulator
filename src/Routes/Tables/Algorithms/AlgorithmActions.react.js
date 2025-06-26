import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import KeycloakServices from 'keycloak/keycloakServices';
import {
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { keycloakRoles } from '@hkube/consts';
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
  const isRoleEdit = KeycloakServices.getUserRoles(keycloakRoles.API_EDIT);
  const isRoleDelete = KeycloakServices.getUserRoles(keycloakRoles.API_DELETE);

  const [openPopupRun, setOpenPopupRun] = useState(false);
  const [openPopupRunDebug, setOpenPopupRunDebug] = useState(false);
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

  const onEdit = useCallback(
    () => goTo.edit({ nextAlgorithmId: name }),
    [goTo, name]
  );

  const onClickDelete = useCallback(
    () => deleteConfirmAction(() => deleteAlgorithm(name)),
    [deleteAlgorithm, name]
  );

  const onRun = useCallback(
    input => runAlgorithm({ name, input }),
    [runAlgorithm, name]
  );

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

  const clickOnRunAlg = useCallback(() => {
    onRun();
    setOpenPopupRun(false);
  }, [onRun]);

  const handleOpenChange = useCallback(newOpen => {
    setOpenPopupRun(newOpen);
  }, []);

  const clickOnRunDebug = useCallback(() => {
    onDebug();
    setOpenPopupRunDebug(false);
  }, [onDebug]);

  const handleOpenChangeDebug = useCallback(newOpen => {
    setOpenPopupRunDebug(newOpen);
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
          mouseLeaveDelay={0.3}
          mouseEnterDelay={1.3}
          open={openPopupRun}
          onOpenChange={handleOpenChange}>
          <Button
            icon={<PlayCircleOutlined />}
            onClick={() => clickOnRunAlg()}
          />
        </Popover>
        <Popover
          overlayStyle={overlayStyle}
          title="Debug Algorithm"
          placement="leftBottom"
          content={popOverContentDebug}
          getPopupContainer={setPopupContainer}
          mouseLeaveDelay={0.3}
          mouseEnterDelay={1.3}
          open={openPopupRunDebug}
          onOpenChange={handleOpenChangeDebug}>
          <Button icon={<BugOutlined />} onClick={() => clickOnRunDebug()} />
        </Popover>
        <Tooltip
          title={isRoleEdit ? 'edit algorithm' : 'not have permission to edit'}>
          <Button
            icon={<EditOutlined />}
            onClick={onEdit}
            disabled={!isRoleEdit}
          />
        </Tooltip>
        <Tooltip
          title={
            isRoleDelete ? 'delete algorithm' : 'not have permission to delete'
          }>
          <Button
            icon={<DeleteOutlined />}
            onClick={onClickDelete}
            disabled={!isRoleDelete}
          />
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
