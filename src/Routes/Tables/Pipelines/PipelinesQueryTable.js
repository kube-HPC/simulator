import React, { useEffect, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Form, AutoComplete } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { FiltersForms } from 'styles';

const PipelinesQueryTable = ({ onSubmit, pipelinesList }) => {
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
  const submitDebounced = useDebouncedCallback(SubmitForm, 500);

  useEffect(() => {
    if (instanceFilters.pipelines.qPipelineName === null) {
      form.resetFields();
      setTimeout(() => {
        SubmitForm(null);
      }, 100);
    }
  }, [form, instanceFilters.pipelines.qPipelineName]);

  useEffect(() => {
    const paramsUrl = qs.parse(urlParams.search, {
      ignoreQueryPrefix: true,
      allowDots: true,
      skipNulls: true,
    });

    if (paramsUrl.qPipelineName) {
      form.setFieldValue('qPipelineName', paramsUrl.qPipelineName);

      setTimeout(() => {
        SubmitForm(paramsUrl.qPipelineName || null);
      }, 500);
    }
  }, []);

  const onFinish = values => {
    onSubmit(values);
  };

  const pipelineOptions = useMemo(
    () =>
      pipelinesList?.map(pipeline => ({
        value: pipeline.name,
        label: pipeline.name,
      })),
    [pipelinesList]
  );

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
          onSearch={submitDebounced}
          onSelect={SubmitForm}
          onClear={SubmitForm}
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
