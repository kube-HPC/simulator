import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Card as AntCard } from 'antd';

const CardOverflow = styled(AntCard)`
  overflow: auto;
`;

const Card = ({
  children,
  isMargin,
  bordered,
  actions,
  style,
  bodyStyle,
  ...props
}) => (
  <CardOverflow
    bodyStyle={bodyStyle}
    size="small"
    style={{ marginRight: isMargin ? '50px' : 'none', ...style }}
    actions={actions}
    bordered={bordered}
    // eslint-disable-next-line
    {...props}>
    {children}
  </CardOverflow>
);

Card.Meta = AntCard.Meta;
Card.Grid = AntCard.Grid;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  isMargin: PropTypes.bool,
  // eslint-disable-next-line
  actions: PropTypes.array,
  bordered: PropTypes.bool,
  // eslint-disable-next-line
  style: PropTypes.object,
  // eslint-disable-next-line
  bodyStyle: PropTypes.object,
  ...AntCard.propTypes,
};

Card.defaultProps = {
  isMargin: false,
  actions: [],
  bordered: true,
  style: {},
  bodyStyle: {},
};

export default Card;
