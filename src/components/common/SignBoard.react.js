import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, Popover, Divider, Row, Col, Input } from 'antd';
import _ from 'lodash';

const SignBoard = ({
  onChange,
  type = 'text',
  form,
  name,
  fieldKey,
  placeholder = '',
  msgRules = [],
  titleKeyboard = '',
  keyboardView = [
    // Template
    { title: '', typeButton: 'circle', keys: ['>>', '|', '&'] },
    { title: 'Nodes', typeButton: 'primary', keys: ['test', 'test2', 'test3'] },
  ],
  indexKey,
  width = 300,
  nameRef,
  restField,
}) => {
  const { TextArea } = Input;

  const styleButtons = {
    flexWrap: 'wrap',
  };

  const getValuesInput = nameKey => {
    const fields = form.getFieldsValue();
    const currentNameField = ['listKeyValue', ...nameRef, ...nameKey];
    const field = form.getFieldInstance(currentNameField);
    const lastValue = field?.input?.value || '';
    return { fields, currentNameField, lastValue };
  };

  const writeCharsToInput = (nameKey, value) => {
    const { fields, currentNameField, lastValue } = getValuesInput(nameKey);
    _.set(fields, currentNameField, `${lastValue} ${value}`);
    form.setFieldsValue(fields);
    onChange();
  };

  const DeleteCharsInInput = nameKey => {
    const { fields, currentNameField, lastValue } = getValuesInput(nameKey);
    _.set(
      fields,
      currentNameField,
      lastValue.substring(0, lastValue.lastIndexOf(' '))
    );
    form.setFieldsValue(fields);
    onChange();
  };

  const title = nameKey => {
    const { lastValue } = getValuesInput(nameKey);
    return (
      <>
        <span>{titleKeyboard} </span> <strong>{lastValue}</strong>
      </>
    );
  };

  const content = (iFieldKey, nameKey) =>
    keyboardView &&
    keyboardView.map(itemArray => (
      <div key={`divKV${itemArray.keyId}`}>
        {itemArray.title && (
          <Divider orientation="left">{itemArray.title}</Divider>
        )}

        {itemArray.keys && (
          <Row type="flex" align="middle">
            <Col span={24} className={styleButtons}>
              <Space key={`SpaceVK${iFieldKey}`} style={{ flexWrap: 'wrap' }}>
                {itemArray.keys.map(itemKeys => (
                  <Button
                    key={`keys${iFieldKey}`}
                    type={itemArray.typeButton}
                    onClick={() => writeCharsToInput(nameKey, itemKeys)}>
                    {' '}
                    {itemKeys}{' '}
                  </Button>
                ))}
                <Button
                  key={`delInput${iFieldKey}`}
                  onClick={() => DeleteCharsInInput(nameKey)}>
                  Del
                </Button>
              </Space>
            </Col>
          </Row>
        )}
      </div>
    ));

  return (
    <Popover
      key={`popoverVKey${indexKey}`}
      content={content(fieldKey, name)}
      title={title(name)}
      trigger="click"
      overlayStyle={{ width: '400px' }}>
      <Form.Item
        {...restField}
        name={name}
        fieldKey={fieldKey}
        rules={msgRules}
        initialValue=""
        onChange={onChange}
        key={`inputTextItem${indexKey}`}>
        {type === 'text' ? (
          <Input
            key={`inputText${indexKey}`}
            style={{ width }}
            placeholder={placeholder}
            autoComplete="off"
          />
        ) : (
          <TextArea
            key={`TextArea${indexKey}`}
            style={{ width }}
            placeholder={placeholder}
          />
        )}
      </Form.Item>
    </Popover>
  );
};

SignBoard.propTypes = {
  width: PropTypes.number,
  indexKey: PropTypes.number.isRequired,
  // eslint-disable-next-line
  keyboardView: PropTypes.array,
  titleKeyboard: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,

  form: PropTypes.shape({
    setFieldsValue: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    getFieldInstance: PropTypes.func.isRequired,
  }).isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  name: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fieldKey: PropTypes.array.isRequired,
  // eslint-disable-next-line
  msgRules: PropTypes.array,
  // eslint-disable-next-line
  restField: PropTypes.object.isRequired,
  // eslint-disable-next-line
  nameRef: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SignBoard;
