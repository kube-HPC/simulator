import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Card, Space, Typography } from 'antd';
import styled from 'styled-components';
import RawInputField from 'components/InputField';
import { tryParse } from 'utils';
import useIds from '../../SidebarRight/AddPipeline/Steps/Nodes/useIds';

const ButtonGroupCenter = styled(Space.Compact)`
  display: flex;
  justify-content: center;
  margin-top: 5px;
`;

const InputField = ({ onRemove, idx, ...antFields }) => {
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState();
  const hasRemove = !!onRemove;
  const onInputChange = useCallback(
    ({ target: { value: src } }) => {
      setValue(src);
      const onFail = () => setIsValid(src === '');
      const onSuccess = ({ parsed }) => {
        antFields.onChange(parsed);
        setIsValid(true);
      };
      tryParse({ src, onSuccess, onFail });
    },
    [antFields]
  );

  return (
    <RawInputField
      id={antFields.id}
      tooltip=""
      hasRemove={hasRemove}
      isValid={isValid}
      onRemove={() => onRemove(idx)}
      value={value}
      onChange={onInputChange}
      placeholder='ex. {"key": "value"} Or [1,"2",true]]'
    />
  );
};
InputField.propTypes = {
  onRemove: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
};

const InputsCollection = () => {
  const [ids, appendKey, dropKey] = useIds([0]);
  return (
    <>
      {ids.map(id => (
        <Form.Item
          name={['inputs', id]}
          validateTrigger={['onChange', 'onBlur']}>
          <InputField onRemove={ids.length > 1 ? dropKey : null} idx={id} />
        </Form.Item>
      ))}
      <ButtonGroupCenter>
        <Button
          block
          icon={<PlusOutlined />}
          size="small"
          type="primary"
          onClick={appendKey}>
          Add Input
        </Button>
      </ButtonGroupCenter>
    </>
  );
};

/**
 * @param {{
 *   onSubmit: () => {};
 *   onRum: {};
 * } & import('antd/lib/form').FormComponentProps} props
 */
const AlgorithmRun = ({ onRun, buttonTitle }) => {
  const [form] = Form.useForm();

  const handleRun = useCallback(() => {
    const values = form.getFieldsValue();

    const _values = Object.values(values.inputs)?.filter(
      item => item !== undefined
    );
    if (_values?.length > 0) {
      onRun(_values);
    } else {
      onRun();
    }
  }, [form, onRun]);

  return (
    <Form
      form={form}
      name="runAlgorithm"
      direction="column"
      full
      gutter={[0, 10]}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card size="small">
          <Typography.Text>Algorithm input</Typography.Text>
          <InputsCollection />
        </Card>

        <Button type="primary" size="middle" onClick={handleRun}>
          {buttonTitle}
        </Button>
      </Space>
    </Form>
  );
};

AlgorithmRun.propTypes = {
  onRun: PropTypes.func.isRequired,

  buttonTitle: PropTypes.string.isRequired,
};

export default AlgorithmRun;
