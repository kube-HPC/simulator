import React from 'react';
import PropTypes from 'prop-types';
import BaseTag from 'components/BaseTag';

/** @param {{ status: string; style: React.CSSProperties }} */
const JobStatus = ({ status, style }) => (
  <BaseTag status={status.status} tooltip={status.error} style={style}>
    {status.status}
  </BaseTag>
);

JobStatus.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
  // eslint-disable-next-line
  style: PropTypes.object,
};

export default React.memo(JobStatus);
