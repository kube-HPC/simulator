import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card as AntCard } from 'antd';

const CardOverflow = styled(AntCard)`
  overflow: auto;
`;

const Card = ({ children, isMargin = false, bordered = true, actions, ...props }) => (
  <CardOverflow
    size="small"
    style={{ marginRight: isMargin ? '50px' : 'none' }}
    actions={actions}
    bordered={bordered}
    {...props}>
    {children}
  </CardOverflow>
);

Card.Meta = AntCard.Meta;
Card.Grid = AntCard.Grid;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  isMargin: PropTypes.bool,
  actions: PropTypes.array,
  bordered: PropTypes.bool,
  ...AntCard.propTypes,
};

export default Card;
