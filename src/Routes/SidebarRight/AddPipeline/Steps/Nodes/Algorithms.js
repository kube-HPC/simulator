import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
// import { Input, InputNumber, Switch, Radio, Select } from 'antd';
import { InputNumber, Switch, Radio, Select } from 'antd';
import { Form as CommonForm } from 'components/common';
import useAlgorithm from 'hooks/useAlgorithm';
import Controller from './InputParseJson';
import useWizardContext from '../../useWizardContext';
import { Field as RawField, HorizontalRow } from './../FormUtils';

const { Divider, Collapsible } = CommonForm;

const ctx = createContext();

/** @type {import('./../FormUtils').FieldProps} */
const Field = props => {
  const { getFieldDecorator, rootId } = useContext(ctx);
  return (
    <RawField
      {...props}
      getFieldDecorator={getFieldDecorator}
      rootId={rootId}
    />
  );
};

const AlgorithmNode = ({ id }) => {
  const {
    form: { getFieldDecorator, getFieldValue },
  } = useWizardContext();
  const { collection } = useAlgorithm();

  const sortedAlgorithms = useMemo(
    () => collection.map(item => item.name).sort(),
    [collection]
  );

  const isStreamingPipeline = getFieldValue('pipelineKind') === 'streaming';

  const rootId = `nodes.${id}`;
  return (
    <ctx.Provider value={{ rootId, getFieldDecorator }}>
      <Field name="algorithmName" title="Algorithm name">
        <Select disabled={collection.length === 0}>
          {sortedAlgorithms.map(name => (
            <Select.Option
              key={`nodes.${id}.algorithmName.${name}`}
              value={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Field>
      <Divider>Inputs</Divider>
      <Controller placeholder="Input" tooltip="Input" nodeIdx={id} />
      <Collapsible title="Retry">
        <HorizontalRow>
          <Field name="retry.policy" title="Policy" skipValidation>
            <Radio.Group>
              <Radio.Button value="Never">Never</Radio.Button>
              <Radio.Button value="Always">Always</Radio.Button>
              <Radio.Button value="OnError">OnError</Radio.Button>
              <Radio.Button value="OnCrash">OnCrash</Radio.Button>
            </Radio.Group>
          </Field>
          <Field title="Retry Limit" name="retry.limit" skipValidation>
            <InputNumber min={0} />
          </Field>
        </HorizontalRow>
      </Collapsible>
      <Collapsible title="Options">
        <HorizontalRow>
          {isStreamingPipeline ? (
            <Field name="stateType" title="State Type" skipValidation>
              <Radio.Group>
                <Radio.Button value="stateless">stateless</Radio.Button>
                <Radio.Button value="stateful">stateful</Radio.Button>
              </Radio.Group>
            </Field>
          ) : (
            <Field name="batchOperation" title="Batch Operation" skipValidation>
              <Radio.Group>
                <Radio.Button value="indexed">indexed</Radio.Button>
                <Radio.Button value="cartesian">cartesian</Radio.Button>
              </Radio.Group>
            </Field>
          )}
        </HorizontalRow>
        <HorizontalRow>
          <Field title="Node TTL" name="ttl" skipValidation small>
            <InputNumber min={0} />
          </Field>
          <Field
            title="Include In Result"
            name="includeInResult"
            skipValidation
            small>
            <Switch />
          </Field>
          <Field
            title="Use tensorboard"
            name="metrics.tensorboard"
            skipValidation
            small>
            <Switch />
          </Field>
        </HorizontalRow>
      </Collapsible>
    </ctx.Provider>
  );
};

AlgorithmNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default AlgorithmNode;
