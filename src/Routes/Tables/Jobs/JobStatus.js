import React from 'react';
import PropTypes from 'prop-types';
import { StatusTag } from 'components/StatusTag';

/** @param {{ status: string; style: React.CSSProperties }} */
const JobStatus = ({ status, style }) =>
  status && (
    <StatusTag status={status.status} tooltip={status.error} style={style}>
      {status.status}
    </StatusTag>
  );

JobStatus.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
  // eslint-disable-next-line
  style: PropTypes.object,
};

export default React.memo(JobStatus);
