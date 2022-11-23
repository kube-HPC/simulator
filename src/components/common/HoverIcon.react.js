import React from 'react';
import styled from 'styled-components';
import { mixins } from 'styles';
import PropTypes from 'prop-types';
import Icon from '@ant-design/icons';

const IconHoverStyle = styled.div`
  ${mixins.transition};
  color: ${props => props.theme.COLOR_LAYOUT?.darkBorder};
  :hover {
    color: ${props => props.theme.Styles?.IconHoverStyle?.colorHover};
  }
  font-size: 22px;
  cursor: pointer;
`;

const Hover = ({ type, onClick, styleIcon, ...props }) => {
  const componentIcon = type || <Icon {...props} />;

  return (
    <IconHoverStyle onClick={onClick} style={styleIcon}>
      {componentIcon}
    </IconHoverStyle>
  );
};

const HoverMemo = Hover;
export default { Hover: HoverMemo, IconHoverStyle };

Hover.propTypes = {
  // eslint-disable-next-line react/require-default-props
  type: PropTypes.node,
  // eslint-disable-next-line react/require-default-props
  onClick: PropTypes.func,

  styleIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

Hover.defaultProps = {
  styleIcon: null,
};
