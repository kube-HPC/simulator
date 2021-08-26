import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Switch, Radio, AutoComplete } from 'antd';

import { Form as CommonForm } from 'components/common';
import useAlgorithm from 'hooks/useAlgorithm';
import Controller from './InputParseJson';
import useWizardContext from '../../useWizardContext';
import { Field as RawField, HorizontalRow } from './../FormUtils';

const { Divider, Collapsible } = CommonForm;

const ctx = createContext();

/** @type {import('./../FormUtils').FieldProps} */
const Field = props => {
  const { rootId } = useContext(ctx);
  return <RawField {...props} rootId={rootId} />;
};

const overrides = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    style: {
      textAlign: 'left',
    },
  },
};

const AlgorithmNode = ({ id }) => {
  const { isStreamingPipeline } = useWizardContext();
  const { collection } = useAlgorithm();

  const sortedAlgorithms = useMemo(
    () => collection.map(item => item.name).sort(),
    [collection]
  );

  const rootId = ['nodes', id];
  return (
    <ctx.Provider value={{ rootId }}>
      <Field name="algorithmName" title="Algorithm name">
        <AutoComplete
          disabled={collection.length === 0}
          dataSource={sortedAlgorithms}
          filterOption={(inputValue, option) =>
            option.props.children.indexOf(inputValue) !== -1
          }
        />
      </Field>
      {isStreamingPipeline && (
        <Field name="stateType" title="State Type" required>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="stateless">stateless</Radio.Button>
            <Radio.Button value="stateful">stateful</Radio.Button>
          </Radio.Group>
        </Field>
      )}
      <Divider>Inputs</Divider>
      <Controller placeholder="Input" tooltip="Input" nodeIdx={id} />
      <Collapsible title="Retry">
        <HorizontalRow>
          <Field
            name={['retry', 'policy']}
            title="Policy"
            initialValue="OnCrash"
            overrides={{
              labelAlign: undefined,
              labelCol: { span: 3 },
              wrapperCol: { span: 24 },
            }}
            skipValidation>
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="Never">Never</Radio.Button>
              <Radio.Button value="Always">Always</Radio.Button>
              <Radio.Button value="OnError">OnError</Radio.Button>
              <Radio.Button value="OnCrash">OnCrash</Radio.Button>
            </Radio.Group>
          </Field>
          <Field
            inline={false}
            title="Retry Limit"
            name={['retry', 'limit']}
            initialValue={3}
            skipValidation
            overrides={{
              labelAlign: undefined,
              labelCol: { span: 10 },
            }}>
            <InputNumber min={0} />
          </Field>
        </HorizontalRow>
      </Collapsible>
      <Collapsible title="Options">
        {!isStreamingPipeline && (
          <Field
            overrides={overrides}
            name="batchOperation"
            title="Batch Operation"
            skipValidation
            initialValue="indexed">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="indexed">indexed</Radio.Button>
              <Radio.Button value="cartesian">cartesian</Radio.Button>
            </Radio.Group>
          </Field>
        )}
        <Field
          title="Node TTL"
          name="ttl"
          initialValue={0}
          skipValidation
          overrides={overrides}
          small>
          <InputNumber min={0} />
        </Field>

        <Field
          overrides={overrides}
          title="Include In Pipeline Results"
          name="includeInResult"
          skipValidation
          initialValue={false}
          small>
          <Switch />
        </Field>
        <Field
          overrides={overrides}
          title="Create A Tensorboard"
          name={['metrics', 'tensorboard']}
          skipValidation
          initialValue
          small>
          <Switch defaultChecked />
        </Field>
      </Collapsible>
    </ctx.Provider>
  );
};

AlgorithmNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default AlgorithmNode;
