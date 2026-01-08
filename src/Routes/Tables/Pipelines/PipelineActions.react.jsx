import React, { memo, useCallback, useRef } from 'react';
import { selectors } from 'reducers';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Button, Empty, Popover, Tooltip, Space } from 'antd';
import KeycloakServices from 'keycloak/keycloakServices';
import { keycloakRoles } from '@hkube/consts';

import { USER_GUIDE } from 'const';
import { useActions } from 'hooks';
import isEqual from 'lodash/isEqual';
import { deleteConfirmAction, stopConfirmAction } from 'utils';
import PipelineCreateBoard from './TensorflowBoards/PipelineCreateBoard.react';
import usePath from './usePath';

const {
  TABLE_PIPELINE: { ACTIONS_SELECT },
} = USER_GUIDE;

const title = 'Create Tensor Board for selected Node';

const PipelineActions = ({ pipeline, className = '' }) => {
  const { goTo } = usePath();
  const { deleteStored: remove, stopAllPipeline } = useActions();
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
  const container = useRef();

  // http://hkube.org/spec/#tag/Execution/paths/~1exec~1stored/post
  // Don't use nodes & description
  const { nodes } = pipeline;

  const hasNodes = nodes.length !== 0;

  const onDelete = useCallback(
    () => deleteConfirmAction(remove, pipeline),
    [pipeline, remove]
  );

  const onStop = useCallback(
    () => stopConfirmAction(stopAllPipeline, pipeline),
    [pipeline, stopAllPipeline]
  );

  const setPopupContainer = useCallback(() => container.current, [container]);

  const onUpdate = useCallback(() => {
    goTo.edit({ nextPipelineId: pipeline.name });
  }, [goTo, pipeline]);

  const onEdit = useCallback(() => {
    goTo.overview({ nextPipelineId: pipeline.name });
  }, [pipeline, goTo]);

  const onExecute = useCallback(() => {
    goTo.execute({ nextPipelineId: pipeline.name });
  }, [pipeline, goTo]);

  const popOverContent = hasNodes ? (
    <PipelineCreateBoard name={pipeline.name} nodes={nodes} />
  ) : (
    <Empty />
  );

  const stopPropagation = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={ACTIONS_SELECT}
      role="none"
      ref={container}
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}>
      <Space.Compact className={className} style={{ marginTop: '10px' }}>
        <Popover
          title={title}
          content={popOverContent}
          placement="left"
          getPopupContainer={setPopupContainer}
          mouseLeaveDelay={0.5}>
          {/* This feature has been removed due to lack of customer use
             <Button className="ant-btn-icon-only">
              <Icon component={IconTensorFlow} />
             </Button> */}
        </Popover>

        <Tooltip title={isRoleDelete ? 'Run pipeline' : 'No Run Permission'}>
          <Button
            icon={<PlayCircleOutlined />}
            onClick={onExecute}
            disabled={!isRoleRunOrStop}
          />
        </Tooltip>

        <Tooltip title={isRoleEdit ? 'Edit pipeline' : 'No Edit Permission'}>
          <Button
            icon={<EditOutlined />}
            onClick={onUpdate}
            disabled={!isRoleEdit}
          />
        </Tooltip>
        <Tooltip
          title={isRoleDelete ? 'Delete pipeline' : 'No Delete Permission'}>
          <Button
            icon={<DeleteOutlined />}
            onClick={onDelete}
            disabled={!isRoleDelete}
          />
        </Tooltip>

        <Tooltip
          title={
            isRoleDelete ? 'Stop all jobs of pipeline' : 'No stop permission'
          }>
          <Button
            icon={<StopOutlined />}
            onClick={onStop}
            disabled={!isRoleRunOrStop}
          />
        </Tooltip>
        <Tooltip title="Show overview">
          <Button icon={<InfoCircleOutlined />} onClick={onEdit} />
        </Tooltip>
      </Space.Compact>
    </div>
  );
};

PipelineActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
  className: PropTypes.string,
};

const areEqual = ({ pipeline: a }, { pipeline: b }) => isEqual(a, b);

export default memo(PipelineActions, areEqual);
