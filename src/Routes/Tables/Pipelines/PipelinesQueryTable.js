import React, { useEffect, useRef } from 'react';
import { Form, AutoComplete } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { isValuesFiltersEmpty } from 'utils';
import { FiltersForms } from 'styles';

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
    const isFilterObjEmpty = isValuesFiltersEmpty(instanceFilters.pipelines);
    let paramsPipeline;
    if (!isFilterObjEmpty) {
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
    <FiltersForms layout="inline" form={form} size="medium" onFinish={onFinish}>
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
    </FiltersForms>
  );
};

PipelinesQueryTable.propTypes = {
  onSubmit: PropTypes.func,
};
PipelinesQueryTable.defaultProps = {
  onSubmit: () => {},
  pipelinesList: undefined,
};

PipelinesQueryTable.propTypes = {
  onSubmit: PropTypes.func,
  pipelinesList: PropTypes.arrayOf(PropTypes.object),
};
PipelinesQueryTable.defaultProps = {
  onSubmit: () => {},
};
export default React.memo(PipelinesQueryTable);
