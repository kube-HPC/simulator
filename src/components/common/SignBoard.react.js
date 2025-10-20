import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Space, Popover, Divider, Row, Col, Input } from 'antd';
import _ from 'lodash';

const SignBoard = ({
  onChange,
  type = 'TextArea',
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
  row,
  nameRef,
  restField,
}) => {
  const { TextArea } = Input;
  const inputRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(null);

  const styleButtons = {
    flexWrap: 'wrap',
  };

  const setPosition = () => {
    if (type !== 'text') {
      const textarea = inputRef.current?.resizableTextArea?.textArea;
      setCursorPosition(textarea.selectionStart);
    } else {
      setCursorPosition(inputRef.current.input.selectionStart);
    }
  };

  const getValuesInput = nameKey => {
    const fields = form.getFieldsValue();
    const currentNameField = ['listKeyValue', ...nameRef, ...nameKey];
    const field = form.getFieldInstance(currentNameField);

    const lastValue =
      field?.input?.value || // for Input
      field?.resizableTextArea?.textArea?.value || // for TextArea
      '';

    return { fields, currentNameField, lastValue };
  };

  const writeCharsToInput = (nameKey, value) => {
    const { fields, currentNameField, lastValue } = getValuesInput(nameKey);
    const updatedValue =
      lastValue.slice(0, cursorPosition) +
      value +
      lastValue.slice(cursorPosition);

    _.set(fields, currentNameField, updatedValue);

    // new postion cursor
    const newProstionCursor = cursorPosition + value.length;
    setCursorPosition(newProstionCursor);

    inputRef.current.focus();
    setTimeout(() => {
      if (type !== 'text') {
        const textarea = inputRef.current?.resizableTextArea?.textArea;
        textarea.setSelectionRange(newProstionCursor, newProstionCursor);
      } else {
        inputRef.current.setSelectionRange(
          newProstionCursor,
          newProstionCursor
        );
      }
    }, 2);

    form.setFieldsValue(fields);
    onChange();
  };

  // eslint-disable-next-line no-unused-vars
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
      //  title={title(name)}
      trigger="click"
      styles={{ root: { width: '30vw' } }}>
      <Form.Item
        {...restField}
        name={name}
        fieldKey={fieldKey}
        rules={msgRules}
        initialValue=""
        onChange={onChange}
        onClick={setPosition}
        key={`inputTextItem${indexKey}`}>
        {type === 'text' ? (
          <Input
            ref={inputRef}
            key={`inputText${indexKey}`}
            style={{ width }}
            placeholder={placeholder}
            autoComplete="off"
            onKeyUp={setPosition}
          />
        ) : (
          <TextArea
            ref={inputRef}
            key={`inputText${indexKey}`}
            style={{ width }}
            placeholder={placeholder}
            onKeyUp={setPosition}
            rows={row}
            autoComplete="off"
          />
        )}
      </Form.Item>
    </Popover>
  );
};

SignBoard.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  row: PropTypes.number,
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
