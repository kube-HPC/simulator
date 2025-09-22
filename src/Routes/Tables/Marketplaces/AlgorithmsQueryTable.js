import React, { useEffect, useMemo } from 'react';

import { Form } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { FiltersForms } from 'styles';
import AutoCompleteFloatingLabelInput from 'components/common/FiltersInput/AutoCompleteFloatingLabelInput';

const AlgorithmsQueryTable = ({
  onSubmit = () => {},
  algorithmsList = undefined,
}) => {
  const urlParams = useLocation();
  const instanceFilters = useReactiveVar(instanceFiltersVar);

  const [form] = Form.useForm();

  const SubmitForm = values => {
    const algorithms = {
      qAlgorithmName: values || null,
    };

    instanceFiltersVar({ ...instanceFiltersVar(), algorithms });

    form.submit();
  };

  useEffect(() => {
    if (instanceFilters.algorithms.qAlgorithmName === null) {
      const qAlgorithmNameValue = form.getFieldValue('qAlgorithmName');
      if (qAlgorithmNameValue !== '') {
        form.resetFields();
      }

      setTimeout(() => {
        SubmitForm(null);
      }, 100);
    }
  }, [form, instanceFilters.algorithms.qAlgorithmName]);

  useEffect(() => {
    const paramsUrl = qs.parse(urlParams.search, {
      ignoreQueryPrefix: true,
      allowDots: true,
      skipNulls: true,
    });

    const algorithmName =
      paramsUrl.qAlgorithmName || instanceFilters.algorithms.qAlgorithmName;

    if (algorithmName) {
      form.setFieldValue('qAlgorithmName', algorithmName);
      setTimeout(() => {
        SubmitForm(algorithmName);
      }, 500);
    }
  }, []);

  const onFinish = values => {
    onSubmit(values);
  };

  const algorithmOptions = useMemo(
    () =>
      algorithmsList
        .filter(item => item.name.toLowerCase().startsWith('mark'))
        ?.map(algorithm => ({
          value: algorithm.name,
          label: algorithm.name,
        })),
    [algorithmsList]
  );

  return (
    <FiltersForms layout="inline" form={form} size="medium" onFinish={onFinish}>
      <Form.Item name="qAlgorithmName">
        <AutoCompleteFloatingLabelInput
          label="App Name"
          width="24vw"
          options={algorithmOptions}
          autoFocus
          allowClear
          Submit={SubmitForm}
        />
      </Form.Item>
    </FiltersForms>
  );
};

AlgorithmsQueryTable.propTypes = {
  onSubmit: PropTypes.func,
};

AlgorithmsQueryTable.propTypes = {
  onSubmit: PropTypes.func,
  algorithmsList: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(AlgorithmsQueryTable);
