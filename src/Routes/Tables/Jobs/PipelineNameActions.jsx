import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as FilterOutlined } from 'images/filter-filtering-icon.svg';
import { ReactComponent as IconAddPipeline } from 'images/forward-arrow-icon.svg';
import { Tooltip } from 'antd';
import { USER_GUIDE } from 'const';
import { Ellipsis } from 'components/common';
import { instanceFiltersVar } from 'cache';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';

import usePathPipeline from './../Pipelines/usePath';

const iconSize = {
  width: '20px',
  height: '20px',
  marginLeft: '5px',
  opacity: 0.6,
  cursor: 'pointer',
};

const PipelineNameContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

const IconsContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 55px; /* 20px + 20px + 5px gap */
  justify-content: flex-end;
`;

const PipelineNameActions = ({ pipeline }) => {
  const { goTo: goToPipeline } = usePathPipeline();
  const instanceFilters = useReactiveVar(instanceFiltersVar);

  const filterByPipeline = pipelineName => {
    instanceFiltersVar({
      ...instanceFilters,
      jobs: {
        ...instanceFilters.jobs,
        pipelineName: pipelineName,
      },
    });
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

      <IconsContainer className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
        {pipeline.pipeline.types.includes('stored') && (
          <Tooltip title={`edit pipeline ${pipeline.pipeline.name}`}>
            <IconAddPipeline style={iconSize} onClick={editByPipelineID} />
          </Tooltip>
        )}
        <Tooltip title={`filter jobs by pipeline ${pipeline.pipeline.name}`}>
          <FilterOutlined
            style={iconSize}
            onClick={() => filterByPipeline(pipeline.pipeline.name)}
          />
        </Tooltip>
      </IconsContainer>
    </PipelineNameContainer>
  );
};

PipelineNameActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
};

export default React.memo(PipelineNameActions);
