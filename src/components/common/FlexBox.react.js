import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Children } from 'react';
import styled from 'styled-components';

const FlexAligned = styled(Row)`
  align-items: ${({ align = 'center' }) => align};
  flex-direction: ${({ direction = 'row' }) => direction};
`;

const FlexBox = ({ children, justify, align, gutter, ...props }) => (
  <FlexAligned justify={justify} align={align} gutter={gutter} {...props}>
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

const Auto = ({ children, ...props }) => (
  <FlexBox {...props}>
    {Children.map(children, (item, i) => (
      <FlexBox.Item key={i}>{item}</FlexBox.Item>
    ))}
  </FlexBox>
);

Auto.propTypes = FlexBox.propTypes;

FlexBox.Auto = Auto;

export default FlexBox;
