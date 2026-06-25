import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

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
      title={title}
      onCancel={handleClose}
      width="98%"
      height="90%"
      style={{
        top: 10,
        margin: '0 auto',
        paddingBottom: 0,
      }}
      styles={{
        content: {
          borderRadius: 0,
          padding: 0,
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
        },
        header: {
          margin: 0,
          padding: '12px 16px',
          borderRadius: 0,
        },
        body: {
          height: '80%',
          padding: 0,
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        },
        footer: {
          margin: 0,
          padding: '10px 16px',
        },
      }}
      footer={[
        <Button key="close" type="primary" onClick={handleClose}>
          Close
        </Button>,
      ]}>
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
