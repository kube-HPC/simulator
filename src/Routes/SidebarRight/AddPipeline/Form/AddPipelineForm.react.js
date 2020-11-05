import React, { createContext, memo } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'components/common';
import { Display } from 'styles';
import { Initial, Nodes, Options } from '../Steps';

const steps = [Initial, Nodes, Options];

export const FormContext = createContext();

const AddPipelineForm = ({ form, step }) => {
  const { getFieldDecorator, setFieldsValue } = form;
  const formStore = { getFieldDecorator, setFieldsValue };

  return (
    <Form>
      <FormContext.Provider value={formStore}>
        {steps.map((Step, index) => (
          // TODO: implement a better key
          // eslint-disable-next-line
          <Display key={index} isVisible={step === index}>
            <Step />
          </Display>
        ))}
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
