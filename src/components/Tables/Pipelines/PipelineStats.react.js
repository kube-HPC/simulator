import { boardStatuses } from '@hkube/consts';
import { Tag, Tooltip } from 'antd';
import Text from 'antd/lib/typography/Text';
import { FlexBox, StatusTag } from 'components/common';
import { useBoards, usePipeline } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import BoardStatus from './TensorflowBoards/BoardStatus.react';

const PipelineStats = ({ name, nodes }) => {
  const { dataStats } = usePipeline();

  const { hasMetrics, boards, boardURL } = useBoards({ pipelineName: name });

  // array flat one-liner
  const pipelineStats = [].concat(
    ...[
      ...dataStats
        .filter(status => status.name === name && status.stats.length !== 0)
        .map(({ stats }) => stats),
    ],
  );

  const hasStats = pipelineStats.length !== 0;

  const metricsAvailable = nodes.map(({ nodeName }) => nodeName).some(name => hasMetrics(name));
  const boardsAvailable = boards.length > 0;

  return (
    <>
      {hasStats &&
        pipelineStats.map(([status, count], i) => (
          <StatusTag key={`${status}-${i}`} status={status} count={count} />
        ))}
      {metricsAvailable && (
        <Tooltip title="Tensor Metrics are Available">
          <Tag color="orange">Metrics</Tag>
        </Tooltip>
      )}
      {boardsAvailable && (
        <Tooltip
          title={boards.map(({ name, boardReference, status }) => {
            const link = (
              <div>
                <Text underline>
                  <a
                    href={`${boardURL}/${boardReference}`}
                    target="_blank"
                    rel="nofollow noopener noreferrer">
                    {name}
                  </a>
                </Text>
              </div>
            );

            return status === boardStatuses.RUNNING ? (
              link
            ) : (
              <FlexBox.Auto key={name} gutter={10}>
                {link}
                <BoardStatus status={status} />
              </FlexBox.Auto>
            );
          })}>
          <Tag color="purple">Boards</Tag>
        </Tooltip>
      )}
      {!hasStats && !metricsAvailable && !boardsAvailable && <Tag>No Stats</Tag>}
    </>
  );
};

PipelineStats.propTypes = {
  name: PropTypes.string.isRequired,
  nodes: PropTypes.array.isRequired,
};

export default PipelineStats;
