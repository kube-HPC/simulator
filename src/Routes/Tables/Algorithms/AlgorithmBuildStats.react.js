import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { FlexBox, StatusTag } from 'components/common';

const AlgorithmBuildStats = ({ builds }) => {
  if (builds.length === 0) return <Tag>No Builds</Tag>;

  const statusCounter = builds
    .map(build => build.status)
    // groups by status
    .reduce((acc, curr) => ({ ...acc, [curr]: 1 + (acc[curr] || 0) }), {});

  return (
    <FlexBox justify="start" gutter={0} style={{ flexWrap: 'nowrap' }}>
      {Object.entries(statusCounter).map(([status, count]) => (
        <FlexBox.Item key={status}>
          <StatusTag status={status} count={count} />
        </FlexBox.Item>
      ))}
    </FlexBox>
  );
};

AlgorithmBuildStats.propTypes = {
  builds: PropTypes.arrayOf(
    PropTypes.shape({ status: PropTypes.string.isRequired })
  ),
};

AlgorithmBuildStats.defaultProps = {
  builds: [],
};

export default React.memo(AlgorithmBuildStats);
