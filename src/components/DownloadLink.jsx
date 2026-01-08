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
 * Renders a download link and clicks the link automatically when a non-null
 * href value is set. Accepts a ref with a "download" callback to manually download.
 */
const DownloadLink = forwardRef((props, ref) => {
  const { href, autoDownload } = props;
  const { backendApiUrl } = useSelector(selectors.config);
  const linkRef = useRef();

  const download = useCallback(() => {
    if (href !== null && linkRef.current) {
      linkRef.current.click();
    }
  }, [href]);

  useEffect(() => {
    if (autoDownload) {
      download();
    }
  }, [download, autoDownload]);

  useImperativeHandle(ref, () => ({
    download,
  }));

  return href ? (
    <a
      style={{ display: 'none' }}
      ref={linkRef}
      href={`${backendApiUrl}/${href}`}
      download="file.zip">
      hidden download link
    </a>
  ) : null;
});

DownloadLink.propTypes = {
  href: PropTypes.string.isRequired,
  autoDownload: PropTypes.bool.isRequired,
};

export default DownloadLink;
