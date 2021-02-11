import React from 'react';
import PropTypes from 'prop-types';

const options = {
  SUCCESS: (_, dataSourceName) => dataSourceName,
  PENDING: () => 'loading...',
};

const Header = ({ status, dataSourceId, dataSourceName }) =>
  ['FAIL', 'NOT_FOUND'].includes(status) ? null : (
    <h2>
      {options[status] ? options[status](dataSourceId, dataSourceName) : ''}
    </h2>
  );

Header.propTypes = {
  status: PropTypes.string.isRequired,
  dataSourceId: PropTypes.string.isRequired,
  dataSourceName: PropTypes.string,
};

Header.defaultProps = {
  dataSourceName: '',
};

export default Header;
