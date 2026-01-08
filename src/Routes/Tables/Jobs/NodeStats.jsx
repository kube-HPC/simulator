import { FlexBox } from 'components/common';
import { COLOR_TASK_STATUS } from 'styles';
import { StatusTag } from 'components/StatusTag';
import PropTypes from 'prop-types';
import React from 'react';

const style = { flexWrap: `nowrap` };

const hasStatus = status => status.data && status.data.states;

const NodeStats = ({ status, ...props }) => (
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
        ([status, count]) => {
          return (
            count && (
              <StatusTag
                key={`${status}`}
                status={status}
                count={count}
                colorMap={COLOR_TASK_STATUS}
              />
            )
          );
        }
      )
    ) : (
      <StatusTag count={null} />
    )}
  </FlexBox.Auto>
);
NodeStats.propTypes = {
  // eslint-disable-next-line
  status: PropTypes.object.isRequired,
};

export default React.memo(NodeStats);
