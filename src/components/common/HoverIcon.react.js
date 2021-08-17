import React from 'react';
import styled from 'styled-components';
import { mixins } from 'styles';
import { COLOR_LAYOUT } from 'styles/colors';
import PropTypes from 'prop-types';
import Icon from '@ant-design/icons';

const DarkHoverStyle = styled.div`
  ${mixins.transition};
  color: ${COLOR_LAYOUT.darkBorder};
  :hover {
    color: black;
  }
  font-size: 25px;
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
