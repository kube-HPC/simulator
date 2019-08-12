import React from 'react';
import styled from 'styled-components';

import { Icon } from 'antd';
import { COLOR_LAYOUT } from 'styles/colors';

const DarkHoverStyle = styled(Icon)`
  color: ${COLOR_LAYOUT.darkBorder};
  :hover {
    color: black;
  }
`;

const iconStyle = { fontSize: 22 };

const Hover = ({ type, onClick }) => (
  <DarkHoverStyle type={type} style={iconStyle} onClick={onClick} />
);

export default { Hover, DarkHoverStyle };
