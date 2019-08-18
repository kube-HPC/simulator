import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles/colors';
import { Col } from 'antd';
import { FlexRow } from '.';

const FooterAbsolute = styled.footer`
  background: ${COLOR_LAYOUT.background};
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 9;
  height: 56px;
  padding: 0 24px;
  line-height: 56px;
  border-top: 1px solid ${COLOR_LAYOUT.border};
  width: 100%;
  display: flex;
  justify-content: ${({ isFlexEnd }) => (isFlexEnd ? 'flex-end' : 'space-between')};
`;

const BottomContent = ({ children, extra, ...props }) => (
  <FooterAbsolute isFlexEnd={extra.length === 0} {...props}>
    {extra && (
      <FlexRow>
        {extra.map((value, key) => (
          <Col key={key}>{value}</Col>
        ))}
      </FlexRow>
    )}
    <FlexRow>
      {React.Children.map(children, (child, key) => (
        <Col key={key}>{child}</Col>
      ))}
    </FlexRow>
  </FooterAbsolute>
);

BottomContent.defaultProps = {
  extra: []
};

BottomContent.propTypes = {
  extra: PropTypes.array
};

export default BottomContent;
