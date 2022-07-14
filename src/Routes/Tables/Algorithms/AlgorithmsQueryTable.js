import React, { useEffect } from 'react';
import { Form, AutoComplete } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';

import { useReactiveVar } from '@apollo/client'; // useReactiveVar
// import { ALGORITHM_AND_PIPELINE_NAMES } from 'graphql/queries';
import { instanceFiltersVar } from 'cache';

const AlgorithmsQueryTable = ({ onSubmit, algorithmsList }) => {
  const history = useHistory();
  const urlParams = useLocation();

  const instanceFilters = useReactiveVar(instanceFiltersVar);

  // const [loadingPipeLines, setLoadingPipeLines] = useState(false);

  const [form] = Form.useForm();

  const SubmitForm = values => {
    const _qParams = qs.stringify(
      { qAlgorithmName: values },
      { allowDots: true }
    );

    history.push({
      pathname: urlParams.pathname,
      search: values !== '' ? `?${_qParams}` : '',
    });

    const algorithms = {
      qAlgorithmName: values || null,
    };

    instanceFiltersVar({ ...instanceFiltersVar(), algorithms });

    form.submit();
  };

  // const onReset = () => {
  //  form.resetFields();
  //  SubmitForm();
  // };

  useEffect(() => {
    const locationParsedParams = qs.parse(urlParams.search, {
      ignoreQueryPrefix: true,
      allowDots: true,
      skipNulls: true,
    });

    const AlgorithmNameParam =
      instanceFilters?.algorithms?.qAlgorithmName ||
      locationParsedParams?.qAlgorithmName ||
      '';

    if (AlgorithmNameParam) {
      form.setFieldsValue({
        qAlgorithmName: AlgorithmNameParam,
      });
    }

    SubmitForm(AlgorithmNameParam);
  }, [algorithmsList]);

  const onFinish = values => {
    onSubmit(values);
  };

  const algorithmOptions = algorithmsList?.map(algorithm => ({
    value: algorithm.name,
    label: algorithm.name,
  }));

  // useEffect(() => {
  // setTimeout(setLoadingPipeLines(false), 3000);
  // }, [loadingPipeLines]);
  return (
    <Form
      layout="inline"
      form={form}
      style={{
        justifyContent: 'space-around',
        border: '1px solid #d9d9d9',
        borderRadius: '2px',
        margin: '4px',
        padding: '8px',
        background: 'aliceblue',
        boxShadow: 'box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 2px',
      }}
      size="medium"
      onFinish={onFinish}>
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
    </Form>
  );
};

AlgorithmsQueryTable.propTypes = {
  onSubmit: PropTypes.func,
};
AlgorithmsQueryTable.defaultProps = {
  onSubmit: () => {},
};

AlgorithmsQueryTable.propTypes = {
  onSubmit: PropTypes.func,
  algorithmsList: PropTypes.objectOf(PropTypes.string).isRequired,
};
AlgorithmsQueryTable.defaultProps = {
  onSubmit: () => {},
};
export default React.memo(AlgorithmsQueryTable);
