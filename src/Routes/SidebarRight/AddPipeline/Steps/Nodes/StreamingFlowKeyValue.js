import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import { SignBoard } from 'components/common';
import { Form, Button, Space, Input, Modal, Collapse, Tooltip } from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  NodeIndexOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import useWizardContext from 'Routes/SidebarRight/AddPipeline/useWizardContext';
import { tryParse, tryParseJson } from 'utils';
import { useDebouncedCallback } from 'use-debounce';
import PropTypes from 'prop-types';
import _ from 'lodash';
import GraphPreview from '../../../../Tables/Jobs/GridView/GraphPreview';

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

const IconSave = styled(SaveOutlined)`
  color: #1890ff;
  font-size: 1.5em;
  margin-left: 1ch;
  cursor: pointer;

  &:hover {
    color: #40a9ff;
  }
`;

const SpaceStyle = styled(Space)`
  .ant-space-item:last-of-type {
    margin-left: ${props => (props.$isAutoLeft ? 'auto' : 'none')};
  }
`;

const StreamkeyValue = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyleCollapse = styled(Collapse)`
  .ant-collapse-item {
    border-bottom: 1px solid #eeeeee;
  }

  .ant-collapse-item-active {
    background: rgb(236 244 255);
  }
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
`;

const emptyEditorStatesKeyValue = ['""', null, 'null', ''];

const StreamingFlowKeyValue = ({
  nameRef,
  onChange = () => {},
  value: _value = {},
  valuePlaceholder = '',
  titleKeyboard = '',
  placeholderKey = 'Flow key',
}) => {
  const { initialState, form, valuesState } = useWizardContext();
  const [modal, contextHolder] = Modal.useModal();
  const [value, setValue] = useState(JSON.stringify(_value));
  const [activeKey, setActiveKey] = useState();
  const countNewItemFlow = useRef(1);

  // Track which items have unsaved changes
  const [unsavedChanges, setUnsavedChanges] = useState(new Set());

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

  // Main function to save all form data
  const saveAllChanges = useCallback(() => {
    const res = form
      .getFieldValue(['listKeyValue', ...nameRef])
      .reduce((acc, item) => {
        if (item?.key) {
          return { ...acc, [item.key]: tryParseJson(item?.value) };
        }
        return acc;
      }, {});

    setValue(JSON.stringify(res));
    submitChange();

    // Clear all unsaved changes
    setUnsavedChanges(new Set());
  }, [form, nameRef, submitChange]);

  // Handle individual item save
  const handleSaveItem = useCallback(
    fieldIndex => {
      saveAllChanges();

      // Remove this item from unsaved changes
      setUnsavedChanges(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldIndex);
        return newSet;
      });
    },
    [saveAllChanges]
  );

  // Handle field changes (mark as unsaved, but don't save automatically)
  const handleFieldChange = useCallback(fieldIndex => {
    // Mark this item as having unsaved changes
    setUnsavedChanges(prev => new Set(prev).add(fieldIndex));
  }, []);

  // get list nodes
  const nodeNames = useMemo(
    () => valuesState?.nodes?.map(item => item?.nodeName),
    [valuesState]
  );

  const keyboardView = [
    { keyId: 1, title: '', typeButton: 'circle', keys: ['>>', '|', '&'] },
    { keyId: 2, title: 'Nodes', typeButton: 'primary', keys: nodeNames },
  ];

  const openGraphModal = (e, key) => {
    e.stopPropagation();
    modal.info({
      title: `Preview graph `,
      content: <GraphPreview pipeline={valuesState} keyIndex={key} />,
      width: 1000,
      okText: 'Close',
      okType: 'default',
      closable: true,
    });
  };

  const genExtraCollapse = (name, fieldKey, remove, fieldIndex) => (
    <>
      <Tooltip title="Preview graph flow">
        <IconNodeIndexOutlined onClick={e => openGraphModal(e, fieldKey)} />
      </Tooltip>

      {/* Save button - show only if there are unsaved changes */}
      {unsavedChanges.has(fieldIndex) && (
        <Tooltip title="Save changes">
          <IconSave
            onClick={e => {
              e.stopPropagation();
              handleSaveItem(fieldIndex);
            }}
          />
        </Tooltip>
      )}

      <Tooltip title="Delete flow">
        <IconDelete
          onClick={e => {
            e.stopPropagation();
            remove(name);
            // Remove from unsaved changes if it was there
            setUnsavedChanges(prev => {
              const newSet = new Set(prev);
              newSet.delete(fieldIndex);
              return newSet;
            });
            // Save changes after removal
            setTimeout(() => {
              saveAllChanges();
            }, 10);
          }}
        />
      </Tooltip>
    </>
  );

  return (
    <Form.List name={['listKeyValue', ...nameRef]}>
      {(fields, { add, remove }) => {
        const items = fields.map(({ key, name, index, ...restField }) => {
          // Get current field values for display
          const currentKey =
            form.getFieldValue(['listKeyValue', ...nameRef, name, 'key']) ||
            `Item ${key}`;

          const fieldIndex = name;
          const hasUnsavedChanges = unsavedChanges.has(fieldIndex);

          // Add indicator to label if there are unsaved changes
          const displayLabel = hasUnsavedChanges
            ? `${currentKey} *`
            : currentKey;

          return {
            key: String(key), // Use stable field key to prevent re-mounting
            label: displayLabel,
            extra: genExtraCollapse(name, name, remove, fieldIndex),
            children: (
              <SpaceStyle
                style={{
                  display: 'flex',
                  marginBottom: 8,
                  alignItems: 'baseline',
                }}
                align="baseline">
                <StreamkeyValue>
                  <Form.Item
                    {...restField}
                    name={[name, 'key']}
                    rules={[
                      {
                        required: true,
                        message: `Missing ${placeholderKey}`,
                      },
                    ]}>
                    <Input
                      placeholder={placeholderKey}
                      onChange={() => handleFieldChange(fieldIndex)}
                    />
                  </Form.Item>

                  <SignBoard
                    restField={restField}
                    nameRef={nameRef}
                    onChange={() => handleFieldChange(fieldIndex)}
                    type="textArea"
                    form={form}
                    name={[name, 'value']}
                    fieldKey={[name, 'value']}
                    placeholder={valuePlaceholder}
                    msgRules={[{ required: true, message: 'Missing value' }]}
                    titleKeyboard={titleKeyboard}
                    keyboardView={keyboardView}
                    indexKey={key}
                    width="27vw"
                    row={4}
                  />

                  {/* Save button inside each item */}
                  <SaveButtonContainer>
                    <Button
                      type="primary"
                      size="small"
                      icon={<SaveOutlined />}
                      onClick={() => handleSaveItem(fieldIndex)}
                      disabled={!hasUnsavedChanges}>
                      {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                    </Button>
                  </SaveButtonContainer>
                </StreamkeyValue>
              </SpaceStyle>
            ),
          };
        });

        return (
          <>
            <StyleCollapse
              items={items}
              activeKey={activeKey}
              onChange={key => setActiveKey(key)}
              accordion
              ghost
            />

            {contextHolder}

            {/* Global save all button */}
            {unsavedChanges.size > 0 && (
              <Form.Item>
                <Button
                  type="primary"
                  onClick={saveAllChanges}
                  block
                  icon={<SaveOutlined />}>
                  Save All Changes ({unsavedChanges.size} unsaved)
                </Button>
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  const newKey = `new flow item ${countNewItemFlow.current++}`;
                  add({ key: newKey, value: '' });
                  setTimeout(() => {
                    setActiveKey(newKey);
                  }, 100);
                }}
                block
                icon={<PlusOutlined />}>
                Add
              </Button>
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
};

StreamingFlowKeyValue.propTypes = {
  onChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.object,
  // eslint-disable-next-line
  style: PropTypes.object,
  valuePlaceholder: PropTypes.string,
  titleKeyboard: PropTypes.string,
  placeholderKey: PropTypes.string,
  nameRef: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default React.memo(StreamingFlowKeyValue);
