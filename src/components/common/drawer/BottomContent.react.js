import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles/colors';

import 'ant-design-pro/dist/ant-design-pro.css';
import { FooterToolbar } from 'ant-design-pro';

const FooterAbsolute = styled(FooterToolbar)`
  background: ${COLOR_LAYOUT.background};
`;

const Divider = styled.div`
  height: 3vh;
`;

function BottomContent({ children, extra }) {
  return (
    <>
      <Divider />
      <FooterAbsolute style={{ position: 'absolute' }} extra={extra}>
        {children}
      </FooterAbsolute>
    </>
  );
}

BottomContent.propTypes = {
  extra: PropTypes.array
};

export default BottomContent;
