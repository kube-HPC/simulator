import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { Initial, Nodes, Webhooks, Triggers, Options } from './Steps';
import { Form } from 'components/common';
import { Display } from 'styles';
import { addPipeline } from 'actions/pipeline.action';
import schema from 'config/schema/addPipeline.schema';

const steps = [Initial, Nodes, Webhooks, Triggers, Options];

export const FormContext = createContext();

const AddPipelineForm = ({ form, step, isSubmit }) => {
  const { validateFields, getFieldDecorator } = form;
  const dispatch = useDispatch();

  const onSubmit = e => {
    e.preventDefault();
    if (!isSubmit) return;

    validateFields((err, formObject) => {
      console.log(formObject);
      dispatch(addPipeline(formObject));
    });
  };

  const formStore = { getFieldDecorator };

  return (
    <Form onSubmit={onSubmit} id={schema.ID}>
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
