import React, { createContext, memo } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';
import { Initial, Nodes, Options } from './Steps';

const steps = [Initial, Nodes, Options];

export const FormContext = createContext();

const AddPipelineForm = ({ form, step }) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const formStore = { getFieldDecorator, setFieldsValue };
  const CurrentStep = steps[step];
  return (
    <Form>
      <FormContext.Provider value={formStore}>
        <CurrentStep />
      </FormContext.Provider>
    </Form>
  );
};

AddPipelineForm.propTypes = {
  // TODO: detail the props
  // eslint-disable-next-line
  form: PropTypes.object.isRequired,
  step: PropTypes.number.isRequired,
};

export default memo(AddPipelineForm);
