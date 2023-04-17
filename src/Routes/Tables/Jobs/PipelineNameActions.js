import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as FilterOutlined } from 'images/filter-filtering-icon.svg';
import { ReactComponent as IconAddPipeline } from 'images/forward-arrow-icon.svg';
import { Button, Tooltip } from 'antd';
import { USER_GUIDE } from 'const';
import { Ellipsis } from 'components/common';
import { instanceFiltersVar } from 'cache';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';

import usePathPipeline from './../Pipelines/usePath';

const iconSize = {
  width: '32px',
  marginLeft: '5px',
  opacity: 0.6,
  cursor: 'pointer',
};

const PipelineNameContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const PipelineNameActions = ({ pipeline }) => {
  const { goTo: goToPipeline } = usePathPipeline();
  const instanceFilters = useReactiveVar(instanceFiltersVar);

  const filterByPipeline = pipelineName => {
    const filters = instanceFilters;
    filters.jobs.pipelineName = pipelineName;
    instanceFiltersVar({ ...instanceFiltersVar(), filters });
  };

  const editByPipelineID = useCallback(
    () =>
      goToPipeline.edit({
        nextPipelineId: pipeline.pipeline.name,
      }),
    [goToPipeline, pipeline.pipeline.name]
  );

  return (
    <PipelineNameContainer>
      <Ellipsis copyable text={pipeline.pipeline.name} length={40} />

      <Button.Group className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
        <Tooltip title={`edit pipeline ${pipeline.pipeline.name}`}>
          <IconAddPipeline style={iconSize} onClick={editByPipelineID} />
        </Tooltip>
        <Tooltip title={`filter jobs by pipeline ${pipeline.pipeline.name}`}>
          <FilterOutlined
            style={iconSize}
            onClick={() => filterByPipeline(pipeline.pipeline.name)}
          />
        </Tooltip>
      </Button.Group>
    </PipelineNameContainer>
  );
};

PipelineNameActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
};

PipelineNameActions.defaultProps = {};

export default React.memo(PipelineNameActions);
