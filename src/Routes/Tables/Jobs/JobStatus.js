import React from 'react';
import PropTypes from 'prop-types';
import StatusTag from 'components/StatusTag';

const JobStatus = ({ status }) => (
  <StatusTag status={status.status} tooltip={status.error}>
    {status.status}
  </StatusTag>
);

JobStatus.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
};

export default React.memo(JobStatus);
