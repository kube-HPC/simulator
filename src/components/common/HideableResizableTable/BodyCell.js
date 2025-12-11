import React from 'react';
import PropTypes from 'prop-types';

const BodyCell = props => {
  const key = props?.column?.key || props?.column?.dataIndex;
  return (
    <td {...props} data-key={key}>
      {props?.children}
    </td>
  );
};

BodyCell.propTypes = {
  column: PropTypes.object,
  children: PropTypes.node,
};

export default BodyCell;
