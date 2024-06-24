import React, { useEffect, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Form, AutoComplete } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { FiltersForms } from 'styles';

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
  const submitDebounced = useDebouncedCallback(SubmitForm, 500);

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
      algorithmsList?.map(algorithm => ({
        value: algorithm.name,
        label: algorithm.name,
      })),
    [algorithmsList]
  );

  return (
    <FiltersForms layout="inline" form={form} size="medium" onFinish={onFinish}>
      <Form.Item label="Algorithm Name" name="qAlgorithmName">
        <AutoComplete
          style={{ width: '8vw', marginLeft: '1vw' }}
          options={algorithmOptions}
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

AlgorithmsQueryTable.propTypes = {
  onSubmit: PropTypes.func,
};

AlgorithmsQueryTable.propTypes = {
  onSubmit: PropTypes.func,
  algorithmsList: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(AlgorithmsQueryTable);
