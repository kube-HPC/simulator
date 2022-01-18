import React from 'react';
import styled from 'styled-components';
import { mixins } from 'styles';
import PropTypes from 'prop-types';
import Icon from '@ant-design/icons';

const DarkHoverStyle = styled.div`
  ${mixins.transition};
  color: ${props => props.theme.COLOR_LAYOUT.darkBorder};
  :hover {
    color: ${props => props.theme.Styles.darkHoverStyle.colorHover};
  }
  font-size: 22px;
  cursor: pointer;
`;

const Hover = ({ type, onClick, ...props }) => {
  const componentIcon = type || <Icon {...props} />;

  return <DarkHoverStyle onClick={onClick}>{componentIcon}</DarkHoverStyle>;
};

const HoverMemo = Hover;
export default { Hover: HoverMemo, DarkHoverStyle };

Hover.propTypes = {
  // eslint-disable-next-line react/require-default-props
  type: PropTypes.node,
  // eslint-disable-next-line react/require-default-props
  onClick: PropTypes.func,
};
