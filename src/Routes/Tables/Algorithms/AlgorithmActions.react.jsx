import React, { useCallback, useRef, useState } from 'react';
import IDProvider from 'IDProvider';
import PropTypes from 'prop-types';
import KeycloakServices from 'keycloak/keycloakServices';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import {
  BugOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { keycloakRoles } from '@hkube/consts';
import { Button, Modal, Popover, Typography, Tooltip, Space } from 'antd';
import { useActions } from 'hooks';
import RunForm from './RunForm';
import usePath from './usePath';

const deleteConfirmAction = (modal, action) => {
  modal.confirm({
    title: 'Deleting Algorithm',
    modalRender: node => <div data-testid="delete-algorithm-modal">{node}</div>,
    content: (
      <>
        Deleting algorithm will{' '}
        <Typography.Text strong>Delete all</Typography.Text> related pipelines
        and <Typography.Text strong>Stop all</Typography.Text> executions.
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

const overlayStyle = { width: `90ch`, zIndex: 9999 };

const AlgorithmActions = ({ record }) => {
  const { keycloakEnable } = useSelector(selectors.connection);

  const isRoleEdit = keycloakEnable
    ? KeycloakServices.getUserRoles(keycloakRoles.API_EDIT)
    : true;
  const isRoleDelete = keycloakEnable
    ? KeycloakServices.getUserRoles(keycloakRoles.API_DELETE)
    : true;

  const isRoleRunOrStop = keycloakEnable
    ? KeycloakServices.getUserRoles(keycloakRoles.API_EXECUTE)
    : true;

  const [openPopupRun, setOpenPopupRun] = useState(false);
  const [openPopupRunDebug, setOpenPopupRunDebug] = useState(false);
  const { goTo } = usePath();
  const { builds, ...algorithm } = record;
  const { name } = algorithm;

  const { /* applyAlgorithm , */ deleteAlgorithm, runAlgorithm } = useActions();
  const [modal, contextHolderModal] = Modal.useModal();
  const container = useRef();

  // const [inputs, setInputs] = useState(EMPTY_INITIAL);

  const setPopupContainer = useCallback(() => document.body, []);

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
    () => deleteConfirmAction(modal, () => deleteAlgorithm(name)),
    [deleteAlgorithm, modal, name]
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
    <IDProvider dataTestId="buttons-actions">
      <div
        ref={container}
        role="none"
        onClick={stopPropagation}
        onDoubleClick={stopPropagation}>
        {contextHolderModal}
        <Space.Compact>
          {isRoleRunOrStop ? (
            <Popover
              styles={{ root: overlayStyle }}
              title="Run Algorithm"
              placement="leftBottom"
              content={popOverContentRun}
              getPopupContainer={setPopupContainer}
              mouseLeaveDelay={0.3}
              mouseEnterDelay={1.3}
              open={openPopupRun}
              onOpenChange={handleOpenChange}>
              <Button
                data-testid="run"
                icon={<PlayCircleOutlined />}
                onClick={() => clickOnRunAlg()}
              />
            </Popover>
          ) : (
            <Tooltip title="No run permission">
              <Button
                data-testid="run"
                icon={<PlayCircleOutlined />}
                disabled={!isRoleRunOrStop}
              />
            </Tooltip>
          )}
          {isRoleRunOrStop ? (
            <Popover
              styles={{ root: overlayStyle }}
              title="Debug Algorithm"
              placement="leftBottom"
              content={popOverContentDebug}
              getPopupContainer={setPopupContainer}
              mouseLeaveDelay={0.3}
              mouseEnterDelay={1.3}
              open={openPopupRunDebug}
              onOpenChange={handleOpenChangeDebug}>
              <Button
                data-testid="debug"
                icon={<BugOutlined />}
                onClick={() => clickOnRunDebug()}
              />
            </Popover>
          ) : (
            <Tooltip title="No debug permission">
              <Button
                data-testid="debug"
                icon={<BugOutlined />}
                disabled={!isRoleRunOrStop}
              />
            </Tooltip>
          )}
          <Tooltip title={isRoleEdit ? 'Edit algorithm' : 'No edit permission'}>
            <Button
              data-testid="edit"
              icon={<EditOutlined />}
              onClick={onEdit}
              disabled={!isRoleEdit}
            />
          </Tooltip>
          <Tooltip
            title={isRoleDelete ? 'Delete algorithm' : 'No delete permission'}>
            <Button
              data-testid="delete"
              icon={<DeleteOutlined />}
              onClick={onClickDelete}
              disabled={!isRoleDelete}
            />
          </Tooltip>
          <Tooltip title="Show overview">
            <Button
              data-testid="overview"
              icon={<InfoCircleOutlined />}
              onClick={onMoreInfo}
            />
          </Tooltip>
        </Space.Compact>
      </div>
    </IDProvider>
  );
};

AlgorithmActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  record: PropTypes.object.isRequired,
};

export default React.memo(AlgorithmActions);
