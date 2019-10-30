import React, { createContext, memo } from 'react';
import PropTypes from 'prop-types';

import { Initial, Nodes, Options } from './Steps';
import { Form } from 'components/common';
import { Display } from 'styles';

const steps = [Initial, Nodes, Options];

export const FormContext = createContext();

const AddPipelineForm = ({ form, step }) => {
  const { getFieldDecorator, setFieldsValue, validateFields } = form;
  const formStore = { getFieldDecorator, setFieldsValue, validateFields };

  return (
    <Form>
      <FormContext.Provider value={formStore}>
        {steps.map((Step, index) => (
          <Display key={index} isVisible={step === index}>
            <Step />
          </Display>
        ))}
      </FormContext.Provider>
    </Form>
  );
};

AddPipelineForm.propTypes = {
  form: PropTypes.object.isRequired,
  step: PropTypes.number.isRequired
};

export default memo(AddPipelineForm);
