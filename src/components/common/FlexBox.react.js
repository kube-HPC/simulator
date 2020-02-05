import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Children } from 'react';
import styled from 'styled-components';
import { prop, switchProp } from 'styled-tools';

const FlexAligned = styled(Row)`
  align-items: ${prop('align', 'center')};
  flex-direction: ${prop('direction', 'row')};
`;

const FlexBox = ({
  children,
  align,
  direction,
  innerRef,
  justify = 'space-between',
  type = 'flex',
  gutter = 10,
  ...props
}) => (
  <FlexAligned
    ref={innerRef}
    justify={justify}
    align={align}
    gutter={gutter}
    direction={direction}
    type={type}
    {...props}>
    {children}
  </FlexAligned>
);

FlexBox.propTypes = Row.propTypes;

const ColFull = styled(Col)`
  width: ${switchProp('full', {
    true: '100%',
    false: 'fit-content',
  })};
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
