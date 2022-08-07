import React, { useEffect, useRef } from 'react';
import { Form, AutoComplete } from 'antd';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import { useReactiveVar } from '@apollo/client';
import { instanceFiltersVar } from 'cache';
import { isValuesFiltersEmpty } from 'utils';
import { FiltersForms } from 'styles';

const AlgorithmsQueryTable = ({ onSubmit, algorithmsList }) => {
  const firstUpdate = useRef(true);
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
    const isFilterObjEmpty = isValuesFiltersEmpty(instanceFilters.algorithms);

    let paramsAlgorithm;
    if (!isFilterObjEmpty) {
      const paramsUrl = qs.parse(urlParams.search, {
        ignoreQueryPrefix: true,
        allowDots: true,
        skipNulls: true,
      });
      paramsAlgorithm = paramsUrl.qAlgorithmName;
    } else {
      paramsAlgorithm = instanceFilters.algorithms.qAlgorithmName;
    }

    form.setFieldsValue({
      qAlgorithmName: paramsAlgorithm,
    });
    SubmitForm(paramsAlgorithm || null);
  }, [algorithmsList]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (!instanceFilters.algorithms.qAlgorithmName) {
      form.resetFields();

      form.submit();
    }
  }, [instanceFilters.algorithms.qAlgorithmName]);

  const onFinish = values => {
    onSubmit(values);
  };

  const algorithmOptions = algorithmsList?.map(algorithm => ({
    value: algorithm.name,
    label: algorithm.name,
  }));

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
          onChange={SubmitForm}
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
