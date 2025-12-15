import React from 'react';

import PropTypes from 'prop-types';

const TableBodyCell = props => {
  const { column, children, ...rest } = props;
  const key = column?.key || column?.dataIndex;
  return (
    <td {...rest} data-key={key}>
      {children}
    </td>
  );
};

TableBodyCell.propTypes = {
  column: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  children: PropTypes.node,
};
