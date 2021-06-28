import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RemoteDetails from './RemoteDetails';

const options = {
  SUCCESS: (_, dataSourceName) => dataSourceName,
  PENDING: () => 'loading...',
};

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
`;

const Header = ({ status, dataSourceId, dataSourceName, git, storage }) =>
  ['FAIL', 'NOT_FOUND'].includes(status) ? null : (
    <HeaderContainer>
      <h2>
        {options[status] ? options[status](dataSourceId, dataSourceName) : ''}
      </h2>
      <RemoteDetails storage={storage} git={git} />
    </HeaderContainer>
  );

Header.propTypes = {
  status: PropTypes.string.isRequired,
  dataSourceId: PropTypes.string.isRequired,
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

Header.defaultProps = {
  git: {
    repositoryUrl: null,
    kind: 'internal',
  },
  storage: {
    kind: 'internal',
    bucketName: null,
    endpoint: null,
  },
  dataSourceName: '',
};

export default Header;
