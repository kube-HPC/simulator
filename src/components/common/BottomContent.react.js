import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BottomPosition } from 'styles';
import FlexBox from './FlexBox.react';

const DEFAULT_HEIGHT = '3.5rem';

const Divider = styled.div`
  height: ${DEFAULT_HEIGHT};
`;

const BottomContent = ({ children, extra = [] }) => (
  <BottomPosition>
    <FlexBox style={{ height: DEFAULT_HEIGHT }}>
      <FlexBox.Item>
        <FlexBox>
          {extra.map((value, key) => (
            // eslint-disable-next-line
            <FlexBox.Item key={key}>{value}</FlexBox.Item>
          ))}
        </FlexBox>
      </FlexBox.Item>
      <FlexBox.Item>
        <FlexBox>
          {React.Children.map(children, (child, key) => (
            // eslint-disable-next-line
            <FlexBox.Item key={key}>{child}</FlexBox.Item>
          ))}
        </FlexBox>
      </FlexBox.Item>
    </FlexBox>
  </BottomPosition>
);

BottomContent.Divider = Divider;
BottomContent.DefaultHeight = DEFAULT_HEIGHT;

BottomContent.propTypes = {
  // eslint-disable-next-line
  extra: PropTypes.array,
  children: PropTypes.node.isRequired,
};
BottomContent.defaultProps = {
  extra: [],
};

export default BottomContent;
