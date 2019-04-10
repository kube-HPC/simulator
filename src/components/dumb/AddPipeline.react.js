import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AddPipelineSteps from 'components/dumb/AddPipelineSteps.react';
import { Row, Col, Divider } from 'antd';

import styled from 'styled-components';
import JsonView from 'components/dumb/JsonView.react';

const HorizontalDivider = styled(Divider)`
  height: -webkit-fill-available;
`;

const ColAlign = styled(Col)`
  margin: auto;
`;

export default function AddPipeline(props) {
  return (
    <div>
      <Row type="flex">
        <Col span={8}>
          <JsonView jsonObject={props.formData} />
        </Col>
        <ColAlign span={1}>
          <HorizontalDivider type="vertical" />
        </ColAlign>
        <ColAlign span={15} style={{ margin: 'auto' }}>
          <AddPipelineSteps
            formData={props.formData}
            algorithms={props.algorithms}
            pipelines={props.pipelines}
            onSubmit={props.onSubmit}
            onChange={props.onChange}
          />
        </ColAlign>
      </Row>
    </div>
  );
}

AddPipeline.propTypes = {
  formData: PropTypes.object.isRequired,
  algorithms: PropTypes.array.isRequired,
  pipelines: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};
