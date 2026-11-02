import React from 'react';
import PropTypes from 'prop-types';
import { SyncOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import styled, { useTheme } from 'styled-components';
import { taskStatuses as TASK_STATUS } from '@hkube/consts';
import { toUpperCaseFirstLetter } from 'utils/stringHelper';

const TagTheme = styled(Tag)`
  color: ${props => props.$textColor};

  ${props =>
    !props.theme.Styles.isTagFill
      ? `border: 1px solid ${props.$borderColor};background-color:${props.$borderColor}22`
      : props.$isBright
        ? `border: 1px solid${props.theme.COLOR.lightGrey}`
        : undefined}
`;

const BaseTag = ({
  style,
  status = null,
  children = null,
  colorMap,
  tooltip = null,
  isActiveLoader = true,
  isError = false,
}) => {
  const theme = useTheme();
  const activeColorMap = colorMap || theme.COLOR_PIPELINE_STATUS;
  const isFailedSchedulingError =
    isError && status === TASK_STATUS.FAILED_SCHEDULING;
  const color = isFailedSchedulingError
    ? activeColorMap.failed
    : status
      ? activeColorMap[status]
        ? activeColorMap[status]
        : activeColorMap.default
      : activeColorMap.default;

  const isBright =
    [theme.COLOR.lightGrey, theme.COLOR.white].includes(color) || !color;
  const textColor = isBright
    ? theme.COLOR.transparentBlack
    : theme.COLOR.white;

  return (
    <Tooltip
      placement="top"
      title={tooltip || (status && toUpperCaseFirstLetter(status))}>
      <TagTheme
        variant="solid"
        $textColor={textColor}
        $borderColor={color}
        $isBright={isBright}
        color={theme.Styles?.isTagFill ? color : ''} // color is prop of Tag ANTD
        style={{ ...style }}
        icon={
          status === 'active' && isActiveLoader ? <SyncOutlined spin /> : null
        }>
        {children}
      </TagTheme>
    </Tooltip>
  );
};

BaseTag.propTypes = {
  children: PropTypes.node,
  status: PropTypes.string,
  colorMap: PropTypes.objectOf(PropTypes.string),
  tooltip: PropTypes.string,
  // eslint-disable-next-line
  style: PropTypes.object,
  isActiveLoader: PropTypes.bool,
  isError: PropTypes.bool,
};

export default BaseTag;
