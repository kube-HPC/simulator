import React from 'react';
import PropTypes from 'prop-types';

import { Card as AntCard } from 'antd';
import styled from 'styled-components';

const CenteredCard = styled(AntCard)`
  margin-right: ${({ isMargin }) => (isMargin ? '50px' : 'none')};
  overflow: auto;
`;

const Card = ({ children, isMargin, ...props }) => (
  <CenteredCard size="small" isMargin={isMargin} {...props}>
    {children}
  </CenteredCard>
);

Card.propTypes = {
  isMargin: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

Card.defaultProps = {
  isMargin: false
};

export default Card;
