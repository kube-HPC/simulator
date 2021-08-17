import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';
import styled from 'styled-components';
import RawInputField from 'components/InputField';
import { tryParse } from 'utils';
import useIds from '../../SidebarRight/AddPipeline/Steps/Nodes/useIds';

const ButtonGroupCenter = styled(Button.Group)`
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
      placeholder="algorithm input"
    />
  );
};
InputField.propTypes = {
  onRemove: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
};

const InputsCollection = ({ getFieldDecorator }) => {
  const [ids, appendKey, dropKey] = useIds([0]);
  return (
    <>
      {ids.map(id =>
        getFieldDecorator(`inputs.${id}`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input algorithm's name or delete this field.",
            },
          ],
        })(<InputField onRemove={ids.length > 1 ? dropKey : null} idx={id} />)
      )}
      <ButtonGroupCenter>
        <Button block icon={<PlusOutlined />} type="dashed" onClick={appendKey}>
          Add Input
        </Button>
      </ButtonGroupCenter>
    </>
  );
};

InputsCollection.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
};

/**
 * @param {{
 *   onSubmit: () => {};
 *   onRum: {};
 * } & import('antd/lib/form').FormComponentProps} props
 */
const AlgorithmRun = ({ onRun, form, buttonTitle }) => {
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
    <Form direction="column" full gutter={[0, 10]}>
      <InputsCollection getFieldDecorator={form.getFieldDecorator} />
      <Button type="primary" block size="small" onClick={handleRun}>
        {buttonTitle}
      </Button>
    </Form>
  );
};

AlgorithmRun.propTypes = {
  onRun: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  buttonTitle: PropTypes.string.isRequired,
};

export default Form.create({ name: 'run algorithm' })(AlgorithmRun);
