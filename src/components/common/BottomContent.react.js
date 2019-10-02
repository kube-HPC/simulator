import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles/colors';
import FlexBox from './FlexBox.react';

const FlexFixed = styled(FlexBox)`
  background: white;
  position: fixed;
  right: 0;
  bottom: 0px;
  height: 56px;
  padding: 0 24px;
  line-height: 56px;
  border-top: 1px solid ${COLOR_LAYOUT.border};
`;

const Divider = () => (
  <>
    <br />
    <br />
  </>
);

const BottomContent = ({ children, extra, width }) => (
  <FlexFixed style={{ width, marginRight: 0, marginLeft: 0 }}>
    <FlexBox.Item>
      <FlexBox>
        {extra.map((value, key) => (
          <FlexBox.Item key={key}>{value}</FlexBox.Item>
        ))}
      </FlexBox>
    </FlexBox.Item>
    <FlexBox.Item>
      <FlexBox>
        {React.Children.map(children, (child, key) => (
          <FlexBox.Item key={key}>{child}</FlexBox.Item>
        ))}
      </FlexBox>
    </FlexBox.Item>
  </FlexFixed>
);

BottomContent.Divider = Divider;

BottomContent.defaultProps = {
  extra: [],
  width: '50vw'
};

BottomContent.propTypes = {
  extra: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string
};

export default BottomContent;
