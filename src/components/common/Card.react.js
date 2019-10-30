import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card as AntCard } from 'antd';

const CardOverflow = styled(AntCard)`
  overflow: auto;
  margin-right: ${({ isMargin }) => (isMargin ? '50px' : 'none')};
`;

const Card = ({ children, isMargin = false, ...props }) => (
  <CardOverflow size="small" isMargin={isMargin} {...props}>
    {children}
  </CardOverflow>
);

Card.propTypes = {
  isMargin: PropTypes.bool,
  children: PropTypes.node
};

Card.defaultProps = {
  isMargin: false
};

export default Card;
