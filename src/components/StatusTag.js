import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import { COLOR_PIPELINE_STATUS, COLOR, COLOR_TASK_STATUS } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/string';

const BaseTag = ({ status, children, colorMap, tooltip }) => {
  const color = colorMap[status];
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
        }}>
        {children}
      </Tag>
    </Tooltip>
  );
};

BaseTag.propTypes = {
  children: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  colorMap: PropTypes.objectOf(PropTypes.string),
  tooltip: PropTypes.string,
};

BaseTag.defaultProps = {
  colorMap: COLOR_PIPELINE_STATUS,
  tooltip: null,
};

export default BaseTag;

const Count = ({ status, count }) => (
  <BaseTag key={status} status={status} colorMap={COLOR_TASK_STATUS}>
    {Number.isInteger(count) ? count : `No Stats`}
  </BaseTag>
);

Count.propTypes = {
  status: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

export { Count };
