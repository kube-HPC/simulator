import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Alert } from 'antd';
import DownloadLink from 'components/DownloadLink';
import { LinkDownload } from './styles';

const DownloadFlowinput = ({ keyValue }) => {
  const [downloadHref, setDownloadHref] = useState(null);
  const handleDownload = useCallback(
    () => setDownloadHref(`exec/flowInput/${keyValue}?download=true`),
    [keyValue, setDownloadHref]
  );

  return (
    <LinkDownload>
      <Button onClick={handleDownload} type="link" size="small">
        <Alert
          message="Click here to download flowInput"
          type="info"
          showIcon
        />{' '}
      </Button>
      <DownloadLink href={downloadHref} />
    </LinkDownload>
  );
};

DownloadFlowinput.propTypes = {
  // eslint-disable-next-line
  keyValue: PropTypes.string.isRequired,
};

DownloadFlowinput.defaultProps = {};

export default React.memo(DownloadFlowinput);
