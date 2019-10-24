import React, { createContext } from 'react';
import PropTypes from 'prop-types';

import { Initial, Nodes, Webhooks, Triggers, Options } from './Steps';
import { Form } from 'components/common';
import { Display } from 'styles';

const steps = [Initial, Nodes, Webhooks, Triggers, Options];

export const FormContext = createContext();

const AddPipelineForm = ({ form, step, isSubmit }) => {
  const { getFieldDecorator } = form;
  const formStore = { getFieldDecorator };

  return (
    <Form>
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
  isSubmit: PropTypes.bool.isRequired,
  step: PropTypes.number.isRequired
};

export default AddPipelineForm;
