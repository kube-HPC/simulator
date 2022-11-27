import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';

/**
 * Renders a download link and clicks the link automatically when a non null
 * href value is set. accepts a ref with a "download" callback to manually download
 */
// eslint-disable-next-line
const DownloadLink = ({ href, autoDownload }, ref) => {
  const { backendApiUrl } = useSelector(selectors.config);
  const linkRef = useRef();

  const download = useCallback(
    () => href !== null && linkRef.current && linkRef.current.click(),
    [href, linkRef]
  );

  useEffect(() => {
    if (!autoDownload) return;
    download();
  }, [download, autoDownload]);

  useImperativeHandle(ref, () => ({ download }));
  return href ? (
    <a
      style={{ display: 'none' }}
      ref={linkRef}
      href={`${backendApiUrl}/${href}`}
      download="file.zip">
      hidden download link
    </a>
  ) : null;
};

const WrappedDownloadLink = forwardRef(DownloadLink);

WrappedDownloadLink.propTypes = {
  href: PropTypes.string,
  autoDownload: PropTypes.bool,
};

WrappedDownloadLink.defaultProps = { href: null, autoDownload: true };

export default WrappedDownloadLink;
