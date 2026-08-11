import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Modal, Spin } from 'antd';
import { logModes } from '@hkube/consts';
import LogsViewer from 'components/common/LogsViewer';
import { useLogs } from 'hooks/graphql';

const MODAL_BODY_HEIGHT = 520;

const TraceLogsModal = ({ open, context, onClose }) => {
  const {
    taskId = '',
    podName = '',
    nodeKind = 'algorithm',
    spanId = '',
  } = context || {};

  const { logs, query } = useLogs({
    taskId,
    podName,
    source: 'es',
    nodeKind,
    logMode: logModes.ALL,
    searchWord: '',
    containerNames: [],
  });

  return (
    <Modal
      destroyOnHidden
      width="60%"
      open={open}
      onCancel={onClose}
      footer={
        <Button type="primary" onClick={onClose}>
          Close
        </Button>
      }
      title={`Logs for Task ${taskId || 'N/A'}`}>
      <div style={{ height: MODAL_BODY_HEIGHT }}>
        {query.loading ? (
          <Spin tip="Loading logs..." />
        ) : query.error ? (
          <Alert
            type="error"
            message="Failed to load logs"
            description={query.error.message}
            showIcon
          />
        ) : (
          <div style={{ height: '95%' }}>
            <LogsViewer
              dataSource={logs}
              id={`${spanId}-${taskId}`}
              emptyDescription="No logs for this step"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

TraceLogsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  context: PropTypes.shape({
    taskId: PropTypes.string,
    podName: PropTypes.string,
    nodeKind: PropTypes.string,
    spanId: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

TraceLogsModal.defaultProps = {
  context: null,
};

export default React.memo(TraceLogsModal);
