import { FlexBox } from 'components/common';
import { Count } from 'components/StatusTag';
import PropTypes from 'prop-types';
import React from 'react';

const style = { flexWrap: `nowrap` };

const hasStatus = status => status.data && status.data.states;

const JobStats = ({ status, ...props }) => (
  <FlexBox.Auto
    justify="center"
    gutter={0}
    style={style}
    // eslint-disable-next-line
    {...props}>
    {hasStatus(status) ? (
      Object.entries(status.data.states).map(
        // TODO: rename status field
        // eslint-disable-next-line
        ([status, count]) => (
          <Count key={`${status}`} status={status} count={count} />
        )
      )
    ) : (
      <Count count={null} />
    )}
  </FlexBox.Auto>
);

JobStats.propTypes = {
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
};

export default React.memo(JobStats);
