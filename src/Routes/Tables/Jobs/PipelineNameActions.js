import React, { useCallback } from 'react';
import styled from 'styled-components';
import { FilterOutlined } from '@ant-design/icons';
import { ReactComponent as IconAddPipeline } from 'images/no-fill/add-pipeline.svg';
import { Button, Tooltip } from 'antd';
import { USER_GUIDE } from 'const';
import { Ellipsis } from 'components/common';
import { instanceFiltersVar } from 'cache';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';

import usePathPipeline from './../Pipelines/usePath';

const iconSize = { width: '17px', fontSize: '12px', cursor: 'pointer' };
const iconSizeFilter = { width: '25px', fontSize: '17px' };

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
      <Ellipsis text={pipeline.pipeline.name} length="40" />

      <Button.Group className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
        <Tooltip title={`filter jobs by pipeline ${pipeline.pipeline.name}`}>
          <FilterOutlined
            style={iconSizeFilter}
            onClick={() => filterByPipeline(pipeline.pipeline.name)}
          />
        </Tooltip>
        <Tooltip title={`edit pipeline ${pipeline.pipeline.name}`}>
          <IconAddPipeline style={iconSize} onClick={editByPipelineID} />
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
