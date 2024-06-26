import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { EditableTagGroup, SignBoard } from 'components/common';
import { Form, Button, Space, Input, Modal } from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import useWizardContext from 'Routes/SidebarRight/AddPipeline/useWizardContext';
import { tryParse, tryParseJson } from 'utils';
import { useDebouncedCallback } from 'use-debounce';
import PropTypes from 'prop-types';
import _ from 'lodash';
import GraphPreview from '../../../../..//Tables/Jobs/GridView/GraphPreview';

const IconDelete = styled(MinusCircleOutlined)`
  color: #999;
  font-size: 1.5em;
  margin-left: 1ch;
`;

const IconNodeIndexOutlined = styled(NodeIndexOutlined)`
  color: #999;
  font-size: 1.5em;
  margin-left: 1ch;
`;

const SpaceStyle = styled(Space)`
  .ant-space-item:last-of-type {
    margin-left: ${props => (props.$isAutoLeft ? 'auto' : 'none')};
  }
`;

const emptyEditorStatesKeyValue = ['""', null, 'null', ''];

const ControllerKeyValue = ({
  nameRef,
  onChange = () => {},
  value: _value = {},
  isValueSignBoard = false,
  valuePlaceholder = '',
  titleKeyboard = '',
  isValueArray = false,
  placeholderKey = 'Flow key',
  isOpenGraphNodes = false,
}) => {
  const { initialState, form, valuesState } = useWizardContext();
  const [modal, contextHolder] = Modal.useModal();
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
      form.setFieldsValue({ ...resFields });
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

  const openGraphModal = key => {
    modal.info({
      title: `Preview graph `,
      content: <GraphPreview pipeline={valuesState} keyIndex={key} />,
      width: 1000,
      okText: 'Close',
      okType: 'default',
      closable: true,
    });
  };

  return (
    <Form.List name={['listKeyValue', ...nameRef]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, index, ...restField }) => (
            <SpaceStyle
              $isAutoLeft={isValueArray}
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
                  width={340}
                />
              ) : isValueArray ? (
                <Form.Item
                  name={[name, 'value']}
                  fieldKey={[fieldKey, 'value']}
                  key={`inputValueItemArray${key}`}>
                  <EditableTagGroup
                    duplicateValue
                    onChange={() => handleChange()}
                  />
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
                    width={340}
                  />
                </Form.Item>
              )}
              {isOpenGraphNodes && (
                <IconNodeIndexOutlined
                  key={`modelGraph${key}`}
                  onClick={() => {
                    openGraphModal(fieldKey);
                  }}
                />
              )}
              <IconDelete
                key={`remove${key}`}
                onClick={() => {
                  remove(name);
                  handleChange();
                }}
              />
            </SpaceStyle>
          ))}
          {contextHolder}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}>
              Add
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
  isOpenGraphNodes: PropTypes.bool,
};

export default React.memo(ControllerKeyValue);
