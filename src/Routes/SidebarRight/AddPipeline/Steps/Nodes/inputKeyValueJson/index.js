import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { EditableTagGroup, SignBoard } from 'components/common';
import { Form, Button, Space, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import useWizardContext from 'Routes/SidebarRight/AddPipeline/useWizardContext';
import { tryParse, tryParseJson } from 'utils';
import { useDebouncedCallback } from 'use-debounce';
import PropTypes from 'prop-types';
import _ from 'lodash';

const IconDelete = styled(MinusCircleOutlined)`
  color: #999;
  font-size: 1.5em;
  margin-left: 1ch;
`;

const emptyEditorStatesKeyValue = ['""', null, 'null', ''];

const ControllerKeyValue = ({
  nameRef,
  onChange,
  value: _value,
  isValueSignBoard,
  valuePlaceholder,
  titleKeyboard,
  isValueArray,
  placeholderKey,
}) => {
  const { initialState, form, valuesState } = useWizardContext();

  const [value, setValue] = useState(JSON.stringify(_value));

  const convertObjectToKeyListKeyValue = () => {
    const valueInitialState = _.get(initialState, [...nameRef]);

    if (valueInitialState) {
      const resFields = [];
      const currentNameField = ['listKeyValue', ...nameRef];
      const resKeyValue = Object.keys(valueInitialState).map(key => ({
        key,
        value:
          typeof valueInitialState[key] === 'object'
            ? JSON.stringify(valueInitialState[key])
            : valueInitialState[key],
      }));

      _.set(resFields, currentNameField, resKeyValue);
      form.setFieldsValue(resFields);
    }
  };

  useEffect(() => {
    // in init update all values from initialState put in all fields list
    convertObjectToKeyListKeyValue();
  }, []);

  useEffect(() => {
    if (
      emptyEditorStatesKeyValue.includes(value) &&
      !emptyEditorStatesKeyValue.includes(_value)
    )
      setValue(JSON.stringify(_value));
  }, [value, setValue, _value]);

  const onApply = useCallback(() => {
    const onSuccess = ({ parsed }) => {
      onChange(parsed);
    };

    if (value) tryParse({ src: value, onSuccess });
  }, [onChange, value]);

  const submitChange = useDebouncedCallback(onApply, 1000);

  const handleChange = useCallback(() => {
    const res = form
      .getFieldValue(['listKeyValue', ...nameRef])
      .reduce(
        (acc, item) => ({ ...acc, [item?.key]: tryParseJson(item?.value) }),
        {}
      );
    setValue(JSON.stringify(res));
    submitChange();
  }, [form, nameRef, submitChange]);

  // get list nodes
  const nodeNames = useMemo(
    () => valuesState?.nodes?.map(item => item?.nodeName),
    [valuesState]
  );

  // build popup button of  virtual keyboard
  const keyboardView = [
    { keyId: 1, title: '', typeButton: 'circle', keys: ['>>', '|', '&'] },
    { keyId: 2, title: 'Nodes', typeButton: 'primary', keys: nodeNames },
  ];

  return (
    <Form.List name={['listKeyValue', ...nameRef]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, index, ...restField }) => (
            <Space
              style={{
                display: 'flex',
                marginBottom: 8,
                alignItems: 'baseline',
              }}
              align="baseline"
              key={`Space${key}`}>
              <Form.Item
                {...restField}
                name={[name, 'key']}
                fieldKey={[fieldKey, 'key']}
                rules={[
                  { required: true, message: `Missing ${placeholderKey}` },
                ]}
                key={`inputName${key}`}
                onChange={() => handleChange()}>
                <Input key={`inputN${key}`} placeholder={placeholderKey} />
              </Form.Item>

              {isValueSignBoard ? (
                <SignBoard
                  restField={restField}
                  nameRef={nameRef}
                  onChange={() => handleChange()}
                  type="text"
                  form={form}
                  name={[name, 'value']}
                  fieldKey={[fieldKey, 'value']}
                  placeholder={valuePlaceholder}
                  msgRules={[{ required: true, message: 'Missing value' }]}
                  titleKeyboard={titleKeyboard}
                  keyboardView={keyboardView}
                  indexKey={key}
                  key={`SignBoard${key}`}
                  width={380}
                />
              ) : isValueArray ? (
                <Form.Item
                  name={[name, 'value']}
                  fieldKey={[fieldKey, 'value']}
                  key={`inputValueItemArray${key}`}>
                  <EditableTagGroup onChange={() => handleChange()} />
                </Form.Item>
              ) : (
                <Form.Item
                  name={[name, 'value']}
                  fieldKey={[fieldKey, 'value']}
                  rules={[{ required: true, message: 'Missing value' }]}
                  onChange={() => handleChange()}
                  key={`inputValueItem${key}`}>
                  <Input
                    placeholder={valuePlaceholder}
                    key={`inputValue${key}`}
                    width={380}
                  />
                </Form.Item>
              )}
              <IconDelete
                key={`remove${key}`}
                onClick={() => {
                  remove(name);
                  handleChange();
                }}
              />
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}>
              Add input
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

ControllerKeyValue.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.object,
  // eslint-disable-next-line
  style: PropTypes.object,
  isValueSignBoard: PropTypes.bool,
  isValueArray: PropTypes.bool,
  valuePlaceholder: PropTypes.string,
  titleKeyboard: PropTypes.string,
  placeholderKey: PropTypes.string,
  nameRef: PropTypes.arrayOf(PropTypes.string).isRequired,
};
ControllerKeyValue.defaultProps = {
  value: {},
  style: {},
  onChange: () => {},
  isValueSignBoard: false,
  isValueArray: false,
  valuePlaceholder: '',
  titleKeyboard: '',
  placeholderKey: 'Flow key',
};
export default React.memo(ControllerKeyValue);
