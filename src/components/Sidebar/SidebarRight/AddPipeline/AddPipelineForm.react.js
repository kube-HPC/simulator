import React, { createContext } from 'react';
import PropTypes from 'prop-types';

import { Initial, Nodes, Webhooks, Triggers, Options } from './Steps';
import { Form } from 'components/common';
import { Display } from 'styles';

const steps = [Initial, Nodes, Webhooks, Triggers, Options];

export const FormContext = createContext();

const AddPipelineForm = ({ onSubmit, form, isLastStep, step }) => {
  const { validateFields, getFieldDecorator } = form;

  const onFormSubmit = e => {
    e.preventDefault();

    if (!isLastStep) return;
    validateFields((err, formObject) => {
      onSubmit();
    });
  };

  const formStore = { getFieldDecorator };

  return (
    <Form onSubmit={onFormSubmit}>
      <FormContext.Provider value={formStore}>
        {steps.map((Step, index) => (
          <Display key={index} isVisible={step === index}>
            <Step {...form} />
          </Display>
        ))}
      </FormContext.Provider>
    </Form>
  );
};

AddPipelineForm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  step: PropTypes.number.isRequired
};

export default AddPipelineForm;
