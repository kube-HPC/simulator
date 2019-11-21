import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card as AntCard } from 'antd';

const CardOverflow = styled(AntCard)`
  overflow: auto;
`;

const Card = ({ children, isMargin = false, ...props }) => (
  <CardOverflow size="small" style={{ marginRight: isMargin ? '50px' : 'none' }} {...props}>
    {children}
  </CardOverflow>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  isMargin: PropTypes.bool,
};

export default Card;
