import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

import { FlexBox } from 'components/common';
import { StatusTag } from 'components/StatusTag';

const AlgorithmBuildStats = ({ builds }) => (
  <FlexBox justify="center" gutter={0} style={{ flexWrap: 'nowrap' }}>
    {builds.total === 0 ? (
      <FlexBox.Item key="No Builds">
        <Tag>No Builds</Tag>
      </FlexBox.Item>
    ) : (
      Object.entries(builds).map(
        ([status, count]) =>
          status !== 'total' &&
          count > 0 && (
            <FlexBox.Item key={status}>
              <StatusTag status={status} count={count} />
            </FlexBox.Item>
          )
      )
    )}
  </FlexBox>
);

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
