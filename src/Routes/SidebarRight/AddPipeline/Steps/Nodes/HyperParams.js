import React, { useContext, useMemo } from 'react';
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
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { usePipeline } from 'hooks';
import { Field as RawField } from '../FormUtils';

const ctx = React.createContext();

const Field = props => {
  const { rootId } = useContext(ctx);
  return <RawField {...props} rootId={rootId} />;
};

const HyperParamsNode = ({ id }) => {
  const rootId = ['nodes', id, 'spec'];

  const { pipelinesCollection } = usePipeline();

  const sortedPipelines = useMemo(
    () =>
      pipelinesCollection
        .map(item => ({
          value: item.name,
        }))
        .sort((a, b) => (a.value > b.value ? 1 : -1)),
    [pipelinesCollection]
  );

  return (
    <ctx.Provider value={{ rootId }}>
      <Field name={['numberOfTrials']} title="Number Of Trials" skipValidation>
        <InputNumber />
      </Field>

      <Field name={['objectivePipeline']} title="objective Pipeline">
        <AutoComplete
          disabled={pipelinesCollection.length === 0}
          options={sortedPipelines}
          filterOption={(inputValue, option) =>
            option.value.indexOf(inputValue) !== -1
          }
        />
      </Field>

      <Divider orientation="left">Params</Divider>

      <Form.List name={['nodes', id, 'spec', 'hyperParams']}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Missing name' }]}
                      label="Name"
                      key={`name_${key}`}
                      initialValue="">
                      <Input placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'suggest']}
                      label="Suggest"
                      validateTrigger={['onChange', 'onBlur']}
                      key={`suggest_${key}`}
                      initialValue="uniform">
                      <Select defaultValue="uniform">
                        <Select.Option value="uniform">uniform</Select.Option>
                        <Select.Option value="loguniform">
                          loguniform
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

                  <Col span={2}> </Col>

                  <Col span={5}>
                    <Form.Item
                      {...restField}
                      name={[name, 'low']}
                      rules={[{ required: true, message: 'Missing low' }]}
                      label="Low"
                      key={`low_${key}`}
                      initialValue="-10">
                      <InputNumber placeholder="low" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'high']}
                      rules={[{ required: true, message: 'Missing high' }]}
                      label="High"
                      key={`high_${key}`}
                      initialValue="10">
                      <InputNumber placeholder="high" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        style={{ fontSize: '120%' }}
                        onClick={() => remove(name)}
                      />
                    ) : null}
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
    </ctx.Provider>
  );
};
HyperParamsNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default HyperParamsNode;
