import React, { useEffect, useMemo } from 'react';
import { Form } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { FiltersForms } from 'styles';
import AutoCompleteFloatingLabelInput from 'components/common/FiltersInput/AutoCompleteFloatingLabelInput';

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
      <Form.Item name="qPipelineName">
        <AutoCompleteFloatingLabelInput
          label="Pipeline Name"
          width="24vw"
          options={pipelineOptions}
          autoFocus
          allowClear
          Submit={SubmitForm}
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
