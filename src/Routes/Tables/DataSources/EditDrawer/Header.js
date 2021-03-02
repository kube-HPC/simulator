import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button as AntdButton, Tooltip } from 'antd';
import { copyToClipboard } from 'utils';

const options = {
  SUCCESS: (_, dataSourceName) => dataSourceName,
  PENDING: () => 'loading...',
};

const Button = styled(AntdButton)`
  margin-left: auto;
`;

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
`;

const Header = ({ status, dataSourceId, dataSourceName, repositoryUrl }) => {
  const onCopyRepositoryUrl = useCallback(() => {
    copyToClipboard(repositoryUrl);
  }, [repositoryUrl]);

  return ['FAIL', 'NOT_FOUND'].includes(status) ? null : (
    <HeaderContainer>
      <h2>
        {options[status] ? options[status](dataSourceId, dataSourceName) : ''}
      </h2>
      {repositoryUrl ? (
        <Tooltip title="copy repository url" placement="left">
          <Button onClick={onCopyRepositoryUrl} icon="branches" type="dashed" />
        </Tooltip>
      ) : null}
    </HeaderContainer>
  );
};

Header.propTypes = {
  status: PropTypes.string.isRequired,
  dataSourceId: PropTypes.string.isRequired,
  dataSourceName: PropTypes.string,
  repositoryUrl: PropTypes.string,
};

Header.defaultProps = {
  dataSourceName: '',
  repositoryUrl: null,
};

export default Header;
