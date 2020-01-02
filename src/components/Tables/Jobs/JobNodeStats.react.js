import React from 'react';
import PropTypes from 'prop-types';
import { FlexBox, StatusTag } from 'components/common';

const style = { flexWrap: `nowrap` };

const JobStats = ({ status }) => (
  <FlexBox justify="center" gutter={0} style={style}>
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
