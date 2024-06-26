import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Select,
  Input,
  Divider,
  InputNumber,
  Row,
  Col,
  Button,
  AutoComplete,
  Switch,
} from 'antd';
import styled from 'styled-components';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useGetLists } from 'hooks/graphql';
import { EditableTagGroup } from 'components/common';
import { unset } from 'lodash';
import { Field as RawField } from '../FormUtils';
import useWizardContext from '../../useWizardContext';
import ControllerKeyValue from '../Nodes/inputKeyValueJson';

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const ctx = React.createContext();

const Field = props => {
  const { rootId } = useContext(ctx);
  return <RawField {...props} rootId={rootId} />;
};

const HyperParamsNode = ({ id }) => {
  const { form, initialState } = useWizardContext();

  const rootId = ['nodes', id, 'spec'];

  const { pipelines: pipelinesCollection } = useGetLists();

  const isSampler = () => {
    const objSpec = initialState?.nodes[id]?.spec;
    return objSpec ? Object.hasOwn(objSpec, 'sampler') : false;
  };

  const [isGridSampler, setIsGridSampler] = useState(() => isSampler());

  const isCategorical = (fields, index) =>
    fields.nodes[id]?.spec.hyperParams[index]?.suggest === 'categorical';

  const SwitchBySuggest = (objFields, val, index) => {
    // remove props not need in json
    const fields = form.getFieldsValue();
    const pathProp = `nodes.${id}.spec.hyperParams.${index}`;

    if (val === 'categorical') {
      unset(fields, `${pathProp}.low`);
      unset(fields, `${pathProp}.high`);
    } else {
      unset(fields, `${pathProp}.choices`);
    }

    form.setFieldsValue(fields);
    /*  const lastObjFields = objFields;
   lastObjFields[index].isCategorical = isCategorical
   setIsSuggestCategorical(lastObjFields); */
  };

  const onChangeGridSampler = val => {
    setIsGridSampler(val);
  };

  const onChangeGridSamplerSearchSpace = () => {
    const fields = form.getFieldsValue();
    const objSearchSpace = fields?.nodes[id]?.spec?.sampler?.search_space;
    const arrayLength = Object.keys(objSearchSpace).map(
      key => objSearchSpace[key].length
    );

    if (arrayLength) {
      fields.nodes[id].spec.numberOfTrials = arrayLength.reduce(
        (a, b) => a * b,
        1
      );
      form.setFieldsValue(fields);
    }
  };

  const contextValue = useMemo(() => ({ rootId }), [rootId]);

  return (
    <ctx.Provider value={contextValue}>
      <Field name={['objectivePipeline']} title="Objective Pipeline">
        <AutoComplete
          disabled={pipelinesCollection?.length === 0}
          options={pipelinesCollection}
          filterOption={(inputValue, option) =>
            option.value.indexOf(inputValue) !== -1
          }
        />
      </Field>

      <Field overrides={{ name: null }} title="Sampler Grid" skipValidation>
        <Switch
          checked={isGridSampler}
          onChange={value => onChangeGridSampler(value)}
        />
      </Field>

      <Field name={['numberOfTrials']} title="Number Of Trials" skipValidation>
        <InputNumber disabled={isGridSampler} />
      </Field>

      <Divider orientation="left">
        {isGridSampler ? 'Sampler Search Space Params' : 'Params'}
      </Divider>
      {!isGridSampler ? (
        <Form.List name={['nodes', id, 'spec', 'hyperParams']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <>
                  <Row>
                    <Col span={23}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Missing name' }]}
                        label="Name"
                        key={`name_${key}`}
                        initialValue="">
                        <Input placeholder="Name" style={{ width: '200px' }} />
                      </Form.Item>
                    </Col>

                    <Col span={1}>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          style={{ fontSize: '120%' }}
                          onClick={() => remove(name)}
                        />
                      ) : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'suggest']}
                        label="Suggest"
                        validateTrigger={['onChange', 'onBlur']}
                        key={`suggest_${key}`}
                        initialValue="uniform">
                        <Select
                          style={{ width: '185px' }}
                          onChange={value =>
                            SwitchBySuggest(fields, value, name)
                          }>
                          <Select.Option value="uniform">uniform</Select.Option>
                          <Select.Option value="loguniform">
                            log uniform
                          </Select.Option>
                          <Select.Option value="int">int </Select.Option>
                          <Select.Option value="discrete_uniform">
                            discrete uniform
                          </Select.Option>
                          <Select.Option value="categorical">
                            categorical
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={14}>
                      <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) =>
                          isCategorical(currentValues, name)
                        }>
                        {() => {
                          const isViewChoices =
                            form.getFieldValue([
                              'nodes',
                              id,
                              'spec',
                              'hyperParams',
                              name,
                              'suggest',
                            ]) === 'categorical';

                          return isViewChoices ? (
                            <Form.Item
                              key={`choices_${key}`}
                              label="Choices"
                              name={[name, 'choices']}>
                              <EditableTagGroup duplicateValue />
                            </Form.Item>
                          ) : (
                            <FlexDiv>
                              <Form.Item
                                {...restField}
                                name={[name, 'low']}
                                rules={[
                                  { required: true, message: 'Missing low' },
                                ]}
                                label="Low"
                                key={`low_${key}`}
                                initialValue={-10}>
                                <InputNumber placeholder="low" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'high']}
                                rules={[
                                  { required: true, message: 'Missing high' },
                                ]}
                                label="High"
                                key={`high_${key}`}
                                initialValue={10}>
                                <InputNumber placeholder="high" />
                              </Form.Item>
                            </FlexDiv>
                          );
                        }}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider />
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}>
                  Add Params
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      ) : (
        <>
          <Form.Item name={['nodes', id, 'spec', 'sampler', 'search_space']}>
            <ControllerKeyValue
              onChange={onChangeGridSamplerSearchSpace}
              isValueArray
              placeholderKey="Param Name"
              nameRef={['nodes', id, 'spec', 'sampler', 'search_space']}
            />
          </Form.Item>

          <Field
            noStyle
            hidden
            name={['sampler', 'name']}
            initialValue="Grid"
            skipValidation>
            <Input type="hidden" />
          </Field>
        </>
      )}
    </ctx.Provider>
  );
};
HyperParamsNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default HyperParamsNode;
