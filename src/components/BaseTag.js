import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Tooltip } from 'antd';
import styled from 'styled-components';
import { COLOR_PIPELINE_STATUS, COLOR, Theme } from 'styles/colors';
import { toUpperCaseFirstLetter } from 'utils/stringHelper';

const TagTheme = styled(Tag)`
  color: ${props => props.$textColor};

  ${props =>
    !props.theme.Styles.isTagFill
      ? `border: 1px solid ${props.$borderColor};background-color:${props.$borderColor}22`
      : props.$isBright
      ? `border: 1px solid${COLOR.lightGrey}`
      : undefined}
`;

const BaseTag = ({ status, children, colorMap, tooltip, style }) => {
  const color = colorMap[status];
  const isBright = [COLOR.lightGrey, COLOR.white].includes(color) || !color;
  const textColor = isBright ? COLOR.transparentBlack : COLOR.white;

  return (
    <Tooltip
      placement="top"
      title={tooltip || (status && toUpperCaseFirstLetter(status))}>
      <TagTheme
        $textColor={textColor}
        $borderColor={color}
        $isBright={isBright}
        color={Theme.Styles?.isTagFill ? color : ''} // color is prop of Tag ANTD
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
  // eslint-disable-next-line
  style: PropTypes.object,
};

BaseTag.defaultProps = {
  status: null,
  colorMap: COLOR_PIPELINE_STATUS,
  tooltip: null,
};

export default BaseTag;
