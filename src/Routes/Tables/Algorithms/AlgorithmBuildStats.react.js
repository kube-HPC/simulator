import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { FlexBox, StatusTag } from 'components/common';

const AlgorithmBuildStats = ({ builds }) => {
  const statusCounter = builds
    .map(build => build.status)
    .reduce((acc, curr) => ({ ...acc, [curr]: 1 + (acc[curr] || 0) }), {});

  const entries = Object.entries(statusCounter);
  const hasStats = entries.length !== 0;

  return hasStats ? (
    <FlexBox justify="start" gutter={0} style={{ flexWrap: 'nowrap' }}>
      {Object.entries(statusCounter).map(([status, count]) => (
        <FlexBox.Item key={status}>
          <StatusTag status={status} count={count} />
        </FlexBox.Item>
      ))}
    </FlexBox>
  ) : (
    <Tag>No Builds</Tag>
  );
};

AlgorithmBuildStats.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  builds: PropTypes.array.isRequired,
};

export default AlgorithmBuildStats;
