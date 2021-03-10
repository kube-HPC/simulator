import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import { COLOR_PIPELINE_STATUS, COLOR, COLOR_TASK_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/string';

const BaseTag = ({
  status,
  children,
  colorMap,
  tooltip,
  taskColorMap,
  style,
}) => {
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
      <Tag
        color={color}
        style={{
          color: textColor,
          border: isBright ? `1px solid ${COLOR.lightGrey}` : undefined,
          ...style,
        }}>
        {children}
      </Tag>
    </Tooltip>
  );
};

BaseTag.propTypes = {
  children: PropTypes.node.isRequired,
  status: PropTypes.string.isRequired,
  colorMap: PropTypes.objectOf(PropTypes.string),
  tooltip: PropTypes.string,
  taskColorMap: PropTypes.bool,
  // eslint-disable-next-line
  style: PropTypes.object,
};

BaseTag.defaultProps = {
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
  status: PropTypes.string.isRequired,
  count: PropTypes.number,
  taskColorMap: PropTypes.bool,
};

Count.defaultProps = {
  count: null,
  taskColorMap: true,
};

export { Count };
