import { Col, Row } from 'antd';
import PropTypes from 'prop-types';
import React, { Children } from 'react';
import styled from 'styled-components';
import { ifProp, prop } from 'styled-tools';

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
  width: ${ifProp('full', '100%', 'fit-content')};
`;

const Item = ({ children, className, full = false, ...props }) => (
  <ColFull className={className} full={full ? `full` : undefined} {...props}>
    {children}
  </ColFull>
);

Item.propTypes = {
  ...Col.propTypes,
  /* eslint-disable */
  className: PropTypes.string,
  full: PropTypes.bool,
  /* eslint-enable */
};

FlexBox.Item = Item;

const Auto = ({ children, full, ...props }) => (
  <FlexBox {...props}>
    {Children.map(children, (item, i) => (
      // eslint-disable-next-line
      <FlexBox.Item key={i} full={full}>
        {item}
      </FlexBox.Item>
    ))}
  </FlexBox>
);

Auto.propTypes = {
  // eslint-disable-next-line
  full: PropTypes.bool,
  ...FlexBox.propTypes,
};

FlexBox.Auto = Auto;

export default FlexBox;
