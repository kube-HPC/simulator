import React from 'react';
import styled from 'styled-components';

import { Icon } from 'antd';
import { COLOR_LAYOUT } from 'styles/colors';

const DarkHoverStyle = styled(Icon)`
  color: ${COLOR_LAYOUT.darkBorder};
  :hover {
    color: black;
  }
  cursor: pointer;
`;

const iconStyle = { fontSize: 22 };

const Hover = ({ type, onClick, ...props }) => (
  <DarkHoverStyle type={type} style={iconStyle} onClick={onClick} {...props} />
);

const HoverMemo = React.memo(Hover);
export default { Hover: HoverMemo, DarkHoverStyle };

Hover.propTypes = Icon.propTypes;
