import React from 'react';
import PropTypes from 'prop-types';
import { Button, Alert } from 'antd';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

import { LinkDownload } from './styles';
import { fetchDownload } from '../../../keycloak/fetchDownload';

const DownloadFlowinput = ({ keyValue }) => {
  const { backendApiUrl } = useSelector(selectors.config);
  return (
    <LinkDownload>
      <Button
        onClick={() =>
          fetchDownload(
            `${backendApiUrl}/api/v1/exec/flowInput/${keyValue}?download=true`
          )
        }
        type="link"
        size="small">
        <Alert
          message="Click here to download flowInput"
          type="info"
          showIcon
        />{' '}
      </Button>
    </LinkDownload>
  );
};

DownloadFlowinput.propTypes = {
  // eslint-disable-next-line
  keyValue: PropTypes.string.isRequired,
};

export default React.memo(DownloadFlowinput);
