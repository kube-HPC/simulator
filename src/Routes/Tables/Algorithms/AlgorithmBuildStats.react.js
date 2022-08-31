import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { FlexBox } from 'components/common';
import { StatusTag } from 'components/StatusTag';

const AlgorithmBuildStats = ({ builds }) => {
  if (builds.total === 0) return <Tag>No Builds</Tag>;

  return (
    <FlexBox justify="start" gutter={0} style={{ flexWrap: 'nowrap' }}>
      {Object.entries(builds).map(
        ([status, count]) =>
          status !== 'total' &&
          count > 0 && (
            <FlexBox.Item key={status}>
              <StatusTag status={status} count={count} />
            </FlexBox.Item>
          )
      )}
    </FlexBox>
  );
};

AlgorithmBuildStats.propTypes = {
  builds: PropTypes.shape({
    status: PropTypes.string,
    total: PropTypes.number,
  }),
};

AlgorithmBuildStats.defaultProps = {
  builds: [],
};

export default React.memo(AlgorithmBuildStats);
