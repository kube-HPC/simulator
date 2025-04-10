import React from 'react';
import {
  pipelineStatuses as PIPELINE_STATUS,
  executeActions as EXECUT_ACTIONS,
} from '@hkube/consts';

import { Badge } from 'antd';
import PropTypes from 'prop-types';
import BaseTag from 'components/BaseTag';

/** @param {{ status: string; style: React.CSSProperties }} */
const JobStatus = ({ status, auditTrail, style }) => {
  let statusAction = '';

  switch (status.status) {
    case PIPELINE_STATUS.STOPPED:
      statusAction = EXECUT_ACTIONS.STOP;
      break;
    case PIPELINE_STATUS.PAUSED:
      statusAction = EXECUT_ACTIONS.PAUSE;
      break;
    case PIPELINE_STATUS.RESUMED:
      statusAction = EXECUT_ACTIONS.RESUME;
      break;
    default:
      statusAction = '';
      break;
  }

  const userName =
    statusAction !== '' && Array.isArray(auditTrail)
      ? auditTrail?.find(x => x.action === statusAction)
      : undefined;

  return (
    (userName && (
      <Badge
        style={{ fontSize: '8px' }}
        count={userName}
        size="small"
        status="success"
        color="blue"
        title={`${userName} is ${status.status}`}
        offset={[-7, 0]}>
        <BaseTag status={status.status} tooltip={status.error} style={style}>
          {status.status}
        </BaseTag>
      </Badge>
    )) || (
      <BaseTag status={status.status} tooltip={status.error} style={style}>
        {status.status}
      </BaseTag>
    )
  );
};

JobStatus.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
  auditTrail: PropTypes.array,
  // eslint-disable-next-line
  style: PropTypes.object,
};

export default React.memo(JobStatus);
