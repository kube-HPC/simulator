import { Icon } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { mixins } from 'styles';
import { COLOR_LAYOUT } from 'styles/colors';

const DarkHoverStyle = styled(Icon)`
  ${mixins.transition};
  color: ${COLOR_LAYOUT.darkBorder};
  :hover {
    color: black;
  }
`;

const iconStyle = { fontSize: 22 };

const Hover = ({ type, onClick, ...props }) => (
  <DarkHoverStyle
    type={type}
    style={iconStyle}
    onClick={onClick}
    // eslint-disable-next-line
    {...props}
  />
);

const HoverMemo = Hover;
export default { Hover: HoverMemo, DarkHoverStyle };

Hover.propTypes = Icon.propTypes;
