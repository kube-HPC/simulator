import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, Switch, Radio } from 'antd';
import { Form as CommonForm } from 'components/common';
import Controller from './InputParseJson';
import useWizardContext from '../../useWizardContext';
import { Field as RawField, HorizontalRow } from './../FormUtils';

const { Divider } = CommonForm;

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
    form: { getFieldDecorator },
  } = useWizardContext();
  const rootId = `nodes.${id}`;
  return (
    <ctx.Provider value={{ rootId, getFieldDecorator }}>
      <Field name="pipelineName" title="Pipeline Name" skipValidation>
        <Input placeholder="Pipeline Name" />
      </Field>
      <Field name="algorithmName" title="Algorithm name">
        <Input placeholder="Algorithm name" />
      </Field>
      <Divider>Inputs</Divider>
      <Controller placeholder="Input" tooltip="Input" nodeIdx={id} />

      <Divider>retry</Divider>
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

      <Divider>Options</Divider>
      <HorizontalRow>
        <Field name="batchOperation" title="Batch Operation" skipValidation>
          <Radio.Group>
            <Radio.Button value="indexed">indexed</Radio.Button>
            <Radio.Button value="cartesian">cartesian</Radio.Button>
          </Radio.Group>
        </Field>
        <Field name="stateType" title="State Type" skipValidation>
          <Radio.Group>
            <Radio.Button value="stateless">stateless</Radio.Button>
            <Radio.Button value="stateful">stateful</Radio.Button>
          </Radio.Group>
        </Field>
      </HorizontalRow>
      <HorizontalRow>
        <Field title="TTL" name="ttl" skipValidation small>
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
    </ctx.Provider>
  );
};

AlgorithmNode.propTypes = {
  id: PropTypes.node.isRequired,
};
export default AlgorithmNode;
