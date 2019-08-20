import React from 'react';
import PropTypes from 'prop-types';

import { Card as AntCard } from 'antd';

const Card = ({ children, isMargin, ...props }) => (
  <AntCard size="small" style={{ marginRight: isMargin ? '50px' : 'none' }} {...props}>
    {children}
  </AntCard>
);

Card.propTypes = {
  isMargin: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

Card.defaultProps = {
  isMargin: false
};

export default Card;
