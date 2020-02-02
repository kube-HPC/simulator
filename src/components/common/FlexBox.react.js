import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Children } from 'react';
import styled from 'styled-components';
import { prop } from 'styled-tools';

const FlexAligned = styled(Row)`
  align-items: ${prop('align', 'center')};
  flex-direction: ${prop('direction', 'row')};
`;

const FlexBox = ({ children, justify, align, gutter, direction, ...props }) => (
  <FlexAligned justify={justify} align={align} gutter={gutter} direction={direction} {...props}>
    {children}
  </FlexAligned>
);

FlexBox.propTypes = Row.propTypes;

const ColFull = styled(Col)`
  width: ${({ full }) => (full === 'true' ? '100%' : 'fit-content')};
`;

const Item = ({ children, className, full = false, ...props }) => (
  <ColFull className={className} full={full.toString()} {...props}>
    {children}
  </ColFull>
);

Item.propTypes = {
  ...Col.propTypes,
  className: PropTypes.string,
  full: PropTypes.bool,
};

FlexBox.Item = Item;

FlexBox.defaultProps = {
  justify: 'space-between',
  type: 'flex',
  gutter: 10,
};

const Auto = ({ children, full, ...props }) => (
  <FlexBox {...props}>
    {Children.map(children, (item, i) => (
      <FlexBox.Item key={i} full={full}>
        {item}
      </FlexBox.Item>
    ))}
  </FlexBox>
);

Auto.propTypes = {
  full: PropTypes.bool,
  ...FlexBox.propTypes,
};

FlexBox.Auto = Auto;

export default FlexBox;
