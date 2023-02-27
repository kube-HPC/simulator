import React, { useEffect, useMemo } from 'react';
import { Form, AutoComplete } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { FiltersForms } from 'styles';

const AlgorithmsQueryTable = ({ onSubmit, algorithmsList }) => {
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
    if (!instanceFilters.algorithms.qAlgorithmName) {
      form.resetFields();
    }
  }, [form, instanceFilters.algorithms.qAlgorithmName]);

  useEffect(() => {
    const paramsUrl = qs.parse(urlParams.search, {
      ignoreQueryPrefix: true,
      allowDots: true,
      skipNulls: true,
    });

    if (paramsUrl.qAlgorithmName) {
      form.setFieldValue('qAlgorithmName', paramsUrl.qAlgorithmName);

      setTimeout(() => {
        SubmitForm(paramsUrl.qAlgorithmName || null);
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
AlgorithmsQueryTable.defaultProps = {
  onSubmit: () => {},
  algorithmsList: undefined,
};

AlgorithmsQueryTable.propTypes = {
  onSubmit: PropTypes.func,
  algorithmsList: PropTypes.arrayOf(PropTypes.object),
};
AlgorithmsQueryTable.defaultProps = {
  onSubmit: () => {},
};
export default React.memo(AlgorithmsQueryTable);
