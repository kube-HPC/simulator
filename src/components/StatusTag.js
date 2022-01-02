import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import styled from 'styled-components';
import { COLOR_PIPELINE_STATUS, COLOR, COLOR_TASK_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/stringHelper';
import { useSiteDarkMode } from 'hooks';

const TagTheme = styled(Tag)`
  color: ${props => props.textColor};
  ${props =>
    props.theme.isDarkMode
      ? `border: 1px solid ${props.borderColor}`
      : props.isBright
      ? `border: 1px solid${COLOR.lightGrey}`
      : undefined}
`;

const BaseTag = ({
  status,
  children,
  colorMap,
  tooltip,
  taskColorMap,
  style,
}) => {
  const { isDarkMode } = useSiteDarkMode();
  let _colorMap = colorMap;
  if (taskColorMap) {
    _colorMap = COLOR_TASK_STATUS;
  }
  const color = _colorMap[status];
  const isBright = [COLOR.lightGrey, COLOR.white].includes(color) || !color;
  const textColor = isBright ? COLOR.transparentBlack : COLOR.white;

  return (
    <Tooltip
      placement="top"
      title={tooltip || (status && toUpperCaseFirstLetter(status))}>
      <TagTheme
        textColor={textColor}
        borderColor={color}
        isBright={isBright}
        color={isDarkMode ? '' : color}
        style={{ ...style }}>
        {children}
      </TagTheme>
    </Tooltip>
  );
};

BaseTag.propTypes = {
  children: PropTypes.node.isRequired,
  status: PropTypes.string,
  colorMap: PropTypes.objectOf(PropTypes.string),
  tooltip: PropTypes.string,
  taskColorMap: PropTypes.bool,
  // eslint-disable-next-line
  style: PropTypes.object,
};

BaseTag.defaultProps = {
  status: null,
  colorMap: COLOR_PIPELINE_STATUS,
  tooltip: null,
  taskColorMap: false,
};

export default BaseTag;

const Count = ({ status, count, taskColorMap }) => (
  <BaseTag key={status} status={status} taskColorMap={taskColorMap}>
    {Number.isInteger(count) ? count : `No Stats`}
  </BaseTag>
);

Count.propTypes = {
  status: PropTypes.string,
  count: PropTypes.number,
  taskColorMap: PropTypes.bool,
};

Count.defaultProps = {
  status: null,
  count: null,
  taskColorMap: true,
};

export { Count };
