import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { boardStatuses } from '@hkube/consts';
import { Tag, Tooltip } from 'antd';
import Text from 'antd/lib/typography/Text';
import { sortBy } from 'lodash';
import { FlexBox } from 'components/common';
import { StatusTag } from 'components/StatusTag';
import { useBoards, usePolling } from 'hooks';
import { useQuery } from '@apollo/client';
import { PIPELINE_STATS_QUERY } from 'graphql/queries';
import BoardStatus from './TensorflowBoards/BoardStatus.react';

const PipelineStats = ({ name, nodes }) => {
  // TODO: replace with selector
  // const { dataStats } = usePipeline();
  const query = useQuery(PIPELINE_STATS_QUERY);
  usePolling(query, 10000);

  const { hasMetrics, boards, boardUrl } = useBoards({ pipelineName: name });

  // array flat one-liner
  const pipelineStats = useMemo(
    () =>
      query && query.data && query.data.pipelineStats
        ? sortBy(
            query?.data?.pipelineStats?.find(s => s.name === name)?.stats,
            ['status']
          )
        : [],
    [query, name]
  );

  const hasStats = pipelineStats?.length !== 0;

  const metricsAvailable = useMemo(
    () =>
      nodes
        .map(({ nodeName }) => nodeName)
        .some(nodeName => hasMetrics(nodeName)),
    [nodes, hasMetrics]
  );
  const boardsAvailable = boards.length > 0;

  return (
    <>
      {hasStats &&
        pipelineStats.map(s => (
          <StatusTag
            key={`${query.data?.name}-${s.status}`}
            status={s.status}
            count={s.count}
            taskColorMap={false}
          />
        ))}
      {metricsAvailable && (
        <Tooltip title="Tensor Metrics are Available">
          <Tag color="orange">Metrics</Tag>
        </Tooltip>
      )}
      {boardsAvailable && (
        <Tooltip
          title={boards.map(({ name: boardName, boardReference, status }) => {
            const link = (
              <div>
                <Text underline>
                  <a
                    href={`${boardUrl}/${boardReference}/`}
                    target="_blank"
                    rel="nofollow noopener noreferrer">
                    {boardName}
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
      {!hasStats && !metricsAvailable && !boardsAvailable && (
        <Tag>No Stats</Tag>
      )}
    </>
  );
};

PipelineStats.propTypes = {
  name: PropTypes.string.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  nodes: PropTypes.array.isRequired,
};

export default React.memo(PipelineStats);
