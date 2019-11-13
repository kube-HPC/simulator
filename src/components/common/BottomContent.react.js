import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FlexBox from './FlexBox.react';
import { BottomPosition } from 'styles';

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
    </FlexBox>
  </BottomPosition>
);

BottomContent.Divider = Divider;
BottomContent.DefaultHeight = DEFAULT_HEIGHT;

BottomContent.propTypes = {
  extra: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
};

export default BottomContent;
