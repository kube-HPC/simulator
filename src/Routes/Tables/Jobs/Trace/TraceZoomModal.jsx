import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const TraceZoomModal = ({ open, title, onClose, children }) => {
  const exitFullscreenIfNeeded = useCallback(async () => {
    if (!document.fullscreenElement) {
      return;
    }
    try {
      await document.exitFullscreen();
    } catch {
      // Ignore exit failures, continue closing the modal.
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const requestFullscreen = async () => {
      if (document.fullscreenElement) {
        return;
      }
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Browser may block fullscreen; modal still opens normally.
      }
    };

    requestFullscreen();

    return () => {
      exitFullscreenIfNeeded();
    };
  }, [open, exitFullscreenIfNeeded]);

  const handleClose = async () => {
    await exitFullscreenIfNeeded();
    onClose();
  };

  return (
    <Modal
      destroyOnHidden
      open={open}
      title={`-  ${title}`}
      onCancel={handleClose}
      width="98%"
      height="98%"
      style={{
        top: 10,
        bottom: 7,
        margin: '0 auto',
        paddingBottom: 0,
      }}
      styles={{
        content: {
          borderRadius: 0,
          padding: 0,
          height: '98%',
          display: 'flex',
          flexDirection: 'column',
        },
        header: {
          // position: 'absolute',
          // zIndex: 10,
          //  marginTop: 15,
          // marginLeft: 130,
          // padding: '5px',
          // borderRadius: 0,
          display: 'none',
        },
        body: {
          height: '98%',
          padding: 0,
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        },
        footer: {
          margin: 0,
          padding: '0px',
        },
      }}
      footer={[]}>
      {children}
    </Modal>
  );
};

TraceZoomModal.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

TraceZoomModal.defaultProps = {
  open: false,
  title: 'Trace zoom',
  onClose: () => {},
  children: null,
};

export default React.memo(TraceZoomModal);
