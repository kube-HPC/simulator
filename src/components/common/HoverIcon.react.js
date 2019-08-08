import React from 'react';
import styled from 'styled-components';

import { Icon } from 'antd';
import { COLOR_LAYOUT } from 'styles/colors';

export const DarkHover = styled(Icon)`
  color: ${COLOR_LAYOUT.darkBorder};
  :hover {
    color: black;
  }
`;

const iconStyle = { fontSize: 22 };

const HoverIcon = ({ type, onClick }) => (
  <DarkHover type={type} style={iconStyle} onClick={onClick} />
);

export default React.memo(HoverIcon);
