import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLOR_LAYOUT } from 'styles/colors';
import FlexBox from './FlexBox.react';

const DEFAULT_HEIGHT = '3.5rem';

const FlexFixed = styled(FlexBox)`
  background: white;
  position: absolute;
  left: 0;
  bottom: 0;
  height: ${DEFAULT_HEIGHT};
  padding: 0 24px;
  border-top: 1px solid ${COLOR_LAYOUT.border};
`;

const Divider = styled.div`
  height: ${DEFAULT_HEIGHT};
`;

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
BottomContent.DefaultHeight = DEFAULT_HEIGHT;

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
