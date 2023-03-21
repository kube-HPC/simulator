import React, { useCallback } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { Button, Tooltip, Row, Col } from 'antd';
import { USER_GUIDE, OVERVIEW_JOB_TABS } from 'const';
import { Ellipsis } from 'components/common';
import { instanceFiltersVar } from 'cache';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';
import usePath from './usePath';

const PipelineNameActions = ({ pipeline }) => {
  const { goTo } = usePath();
  const instanceFilters = useReactiveVar(instanceFiltersVar);

  const filterByPipeline = pipelineName => {
    const filters = instanceFilters;
    filters.jobs.pipelineName = pipelineName;
    instanceFiltersVar({ ...instanceFiltersVar(), filters });
  };

  const onMoreInfo = useCallback(
    () =>
      goTo.overview({
        nextJobId: pipeline.key,
        nextTabKey: OVERVIEW_JOB_TABS.MORE_INFO,
      }),
    [goTo, pipeline.key]
  );

  return (
    <Row>
      <Col span={20}>
        {' '}
        <Ellipsis text={pipeline.pipeline.name} onClick={onMoreInfo} />
      </Col>
      <Col span={2}>
        <Button.Group className={USER_GUIDE.TABLE_JOB.ACTIONS_SELECT}>
          <Tooltip title={`filter jobs by pipeline ${pipeline.pipeline.name}`}>
            <FilterOutlined
              onClick={() => filterByPipeline(pipeline.pipeline.name)}
            />
          </Tooltip>
        </Button.Group>
      </Col>
    </Row>
  );
};

PipelineNameActions.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  pipeline: PropTypes.object.isRequired,
};

PipelineNameActions.defaultProps = {};

export default React.memo(PipelineNameActions);
