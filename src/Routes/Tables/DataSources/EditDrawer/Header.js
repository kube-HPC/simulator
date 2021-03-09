import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Tooltip } from 'antd';
import { copyToClipboard } from 'utils';

const options = {
  SUCCESS: (_, dataSourceName) => dataSourceName,
  PENDING: () => 'loading...',
};

const ButtonContainer = styled.div`
  margin-left: auto;
`;

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
`;

const Header = ({
  status,
  dataSourceId,
  dataSourceName,
  repositoryUrl,
  storage,
}) => {
  const onCopyRepositoryUrl = useCallback(() => {
    copyToClipboard(repositoryUrl);
  }, [repositoryUrl]);

  const onCopyBucket = useCallback(() => {
    if (storage?.kind === 'S3')
      copyToClipboard(
        `endpoint: ${storage.endpoint}, bucketName: ${storage.bucketName}`
      );
  }, [storage]);

  return ['FAIL', 'NOT_FOUND'].includes(status) ? null : (
    <HeaderContainer>
      <h2>
        {options[status] ? options[status](dataSourceId, dataSourceName) : ''}
      </h2>
      <ButtonContainer>
        {storage?.kind === 'S3' ? (
          <Tooltip title="copy storage info" placement="left">
            <Button onClick={onCopyBucket} type="dashed">
              S3
            </Button>
          </Tooltip>
        ) : null}
        {repositoryUrl ? (
          <Tooltip title="copy repository url" placement="left">
            <Button
              style={{ marginLeft: '0.5ch' }}
              onClick={onCopyRepositoryUrl}
              icon="branches"
              type="dashed"
            />
          </Tooltip>
        ) : null}
      </ButtonContainer>
    </HeaderContainer>
  );
};

Header.propTypes = {
  status: PropTypes.string.isRequired,
  dataSourceId: PropTypes.string.isRequired,
  dataSourceName: PropTypes.string,
  repositoryUrl: PropTypes.string,
  storage: PropTypes.shape({
    kind: PropTypes.oneOf(['S3', 'internal']).isRequired,
    bucketName: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
  }),
};

Header.defaultProps = {
  dataSourceName: '',
  repositoryUrl: null,
  storage: null,
};

export default Header;
