import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton } from 'antd';

const SkeletonLoader = ({ SkeletonItem = 10 }) => (
  <>
    {[...Array(SkeletonItem)].map((_, idx) => (
      <Skeleton active key={`skeleton-loader-item-${idx.toString()}`} />
    ))}
  </>
);
SkeletonLoader.propTypes = {
  SkeletonItem: PropTypes.number,
};
export default SkeletonLoader;
