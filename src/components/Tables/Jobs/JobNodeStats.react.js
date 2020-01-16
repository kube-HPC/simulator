import React from 'react';
import PropTypes from 'prop-types';
import { FlexBox, StatusTag } from 'components/common';

const style = { flexWrap: `nowrap` };

const hasStatus = status => status.data && status.data.states;

const JobStats = ({ status, ...props }) => (
  <FlexBox.Auto justify="center" gutter={0} style={style} {...props}>
    {hasStatus(status) ? (
      Object.entries(status.data.states).map(([status, count]) => (
        <StatusTag key={status} status={status} count={count} />
      ))
    ) : (
      <StatusTag count={null} />
    )}
  </FlexBox.Auto>
);

JobStats.propTypes = {
  status: PropTypes.object.isRequired,
};

export default JobStats;
