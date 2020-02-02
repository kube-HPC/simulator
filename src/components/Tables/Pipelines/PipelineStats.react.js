import { StatusTag } from 'components/common';
import { usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';

const PipelineStats = ({ pipeline }) => {
  const { dataStats } = usePipeline();

  // array flat one-liner
  const pipelineStats = [].concat(
    ...[
      ...dataStats
        .filter(status => status.name === pipeline.name && status.stats.length !== 0)
        .map(pipeline => pipeline.stats),
    ],
  );

  const hasStats = pipelineStats.length !== 0;

  return hasStats ? (
    pipelineStats.map(([status, count], i) => (
      <StatusTag key={`${status}-${i}`} status={status} count={count} />
    ))
  ) : (
    <StatusTag count={0} />
  );
};

PipelineStats.propTypes = {
  pipeline: PropTypes.object.isRequired,
};

export default PipelineStats;
