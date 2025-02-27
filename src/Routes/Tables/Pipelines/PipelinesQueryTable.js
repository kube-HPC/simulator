import React, { useEffect, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Form, AutoComplete } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { FiltersForms } from 'styles';

const PipelinesQueryTable = ({
  onSubmit = () => {},
  pipelinesList = undefined,
}) => {
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
      const qqPipelineNameValue = form.getFieldValue('qPipelineName');
      if (qqPipelineNameValue !== '') {
        form.resetFields();
      }
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

    const pipelineName =
      paramsUrl.qPipelineName || instanceFilters.pipelines.qPipelineName;

    if (pipelineName) {
      form.setFieldValue('qPipelineName', pipelineName);
      setTimeout(() => {
        SubmitForm(pipelineName);
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
          style={{ width: '24vw', marginLeft: '1vw' }}
          options={pipelineOptions}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          autoFocus
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

PipelinesQueryTable.propTypes = {
  onSubmit: PropTypes.func,
  pipelinesList: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(PipelinesQueryTable);
