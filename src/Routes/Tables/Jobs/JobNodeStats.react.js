import { FlexBox, StatusTag } from 'components/common';
import PropTypes from 'prop-types';
import React from 'react';
import { COLOR_TASK_STATUS } from 'styles';

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
          <StatusTag
            key={status}
            status={status}
            count={count}
            colorMap={COLOR_TASK_STATUS}
          />
        )
      )
    ) : (
      <StatusTag count={null} />
    )}
  </FlexBox.Auto>
);

JobStats.propTypes = {
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
};

export default React.memo(JobStats);
