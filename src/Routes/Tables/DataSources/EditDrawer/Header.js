import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RemoteDetails from './RemoteDetails';

/* const options = {
  SUCCESS: (_, dataSourceName) => dataSourceName,
  PENDING: () => 'loading...',
}; */

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
`;

const Header = ({
  status = undefined,
  dataSourceName = '',
  git = {
    repositoryUrl: null,
    kind: 'internal',
  },
  storage = {
    kind: 'internal',
    bucketName: null,
    endpoint: null,
  },
}) =>
  ['FAIL', 'NOT_FOUND'].includes(status) ? null : (
    <HeaderContainer>
      <h2>
        {/* options[status] ? options[status](dataSourceId, dataSourceName) : '' */}
        {dataSourceName}
      </h2>
      <RemoteDetails storage={storage} git={git} />
    </HeaderContainer>
  );

Header.propTypes = {
  status: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  dataSourceId: PropTypes.string,
  dataSourceName: PropTypes.string,
  git: PropTypes.shape({
    repositoryUrl: PropTypes.string,
    kind: PropTypes.string.isRequired,
  }),
  storage: PropTypes.shape({
    kind: PropTypes.oneOf(['S3', 'internal']).isRequired,
    bucketName: PropTypes.string,
    endpoint: PropTypes.string,
  }),
};

export default Header;
