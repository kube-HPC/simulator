import React, { useEffect, useRef } from 'react';
import { Form, AutoComplete } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';

const PipelinesQueryTable = ({ onSubmit, pipelinesList }) => {
  const firstUpdate = useRef(true);
  const urlParams = useLocation();
  const instanceFilters = useReactiveVar(instanceFiltersVar);

  const [form] = Form.useForm();

  const SubmitForm = values => {
    const pipelines = {
      qPipelineName: values || null,
    };

    instanceFiltersVar({ ...instanceFiltersVar(), pipelines });

    form.submit();
  };

  useEffect(() => {
    const isFilterObjEmpty = !Object.values(instanceFilters.pipelines).some(
      x => x != null
    );
    let paramsPipeline;
    if (isFilterObjEmpty) {
      const paramsUrl = qs.parse(urlParams.search, {
        ignoreQueryPrefix: true,
        allowDots: true,
        skipNulls: true,
      });
      paramsPipeline = paramsUrl.qPipelineName;
    } else {
      paramsPipeline = instanceFilters.pipelines.qPipelineName;
    }

    form.setFieldsValue({
      qPipelineName: paramsPipeline,
    });
    SubmitForm(paramsPipeline || null);
  }, [pipelinesList]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (!instanceFilters.pipelines.qPipelineName) {
      form.resetFields();

      form.submit();
    }
  }, [instanceFilters.pipelines.qPipelineName]);

  const onFinish = values => {
    onSubmit(values);
  };

  const pipelineOptions = pipelinesList?.map(pipeline => ({
    value: pipeline.name,
    label: pipeline.name,
  }));

  return (
    <Form
      layout="inline"
      form={form}
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '2px',
        margin: '4px',
        padding: '8px',
        background: 'aliceblue',
        boxShadow: 'box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 2px',
      }}
      size="medium"
      onFinish={onFinish}>
      <Form.Item label="Pipeline Name" name="qPipelineName">
        <AutoComplete
          style={{ width: '8vw', marginLeft: '1vw' }}
          options={pipelineOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          allowClear
          onChange={SubmitForm}
        />
      </Form.Item>
    </Form>
  );
};

PipelinesQueryTable.propTypes = {
  onSubmit: PropTypes.func,
};
PipelinesQueryTable.defaultProps = {
  onSubmit: () => {},
};

PipelinesQueryTable.propTypes = {
  onSubmit: PropTypes.func,
  pipelinesList: PropTypes.objectOf(PropTypes.string).isRequired,
};
PipelinesQueryTable.defaultProps = {
  onSubmit: () => {},
};
export default PipelinesQueryTable;
