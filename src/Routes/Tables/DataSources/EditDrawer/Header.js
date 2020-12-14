import React from 'react';
import PropTypes from 'prop-types';

const options = {
  NOT_FOUND: dataSourceId => `could not find dataSource id: ${dataSourceId}`,
  SUCCESS: (_, dataSourceName) => dataSourceName,
  PENDING: () => 'loading...',
  FAIL: dataSourceId => `failed fetching dataSource id: ${dataSourceId}`,
};

const Header = ({ status, dataSourceId, dataSourceName }) => (
  <h1>
    {options[status] ? options[status](dataSourceId, dataSourceName) : ''}
  </h1>
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
