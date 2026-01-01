import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card as AntCard } from 'antd';

const CardOverflow = styled(AntCard)`
  overflow: auto;
`;

const Card = ({
  children,
  isMargin = false,
  bordered = undefined,
  variant = undefined,
  actions = [],
  style = {},
  bodyStyle = {},
  ...props
}) => {
  let finalVariant = variant;
  if (finalVariant === undefined) {
    if (bordered === undefined) {
      finalVariant = 'default';
    } else {
      const borderedBool =
        typeof bordered === 'string' ? bordered === 'true' : Boolean(bordered);
      finalVariant = borderedBool ? 'default' : 'borderless';
    }
  }

  return (
    <CardOverflow
      styles={{ body: { ...bodyStyle } }}
      size="small"
      style={{ marginRight: isMargin ? '50px' : 'none', ...style }}
      actions={actions}
      variant={finalVariant}
      // eslint-disable-next-line
      {...props}>
      {children}
    </CardOverflow>
  );
};

Card.Meta = AntCard.Meta;
Card.Grid = AntCard.Grid;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  isMargin: PropTypes.bool,
  // eslint-disable-next-line
  actions: PropTypes.array,
  bordered: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  variant: PropTypes.oneOf(['default', 'borderless']),
  // eslint-disable-next-line
  style: PropTypes.object,
  // eslint-disable-next-line
  bodyStyle: PropTypes.object,
  ...AntCard.propTypes,
};

export default Card;
