import React from 'react';
import PropTypes from 'prop-types';
import { FlexBox, StatusTag } from 'components/common';

const JobStats = ({ status }) => (
  <FlexBox justify="start" gutter={0} style={{ flexWrap: 'nowrap' }}>
    {status.data &&
      status.data.states &&
      Object.entries(status.data.states).map(([status, count]) => (
        <FlexBox.Item key={status}>
          <StatusTag status={status} count={count} />
        </FlexBox.Item>
      ))}
  </FlexBox>
);

JobStats.propTypes = {
  status: PropTypes.object.isRequired,
};

export default JobStats;
