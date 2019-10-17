/* eslint-disable */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

import { Initial, Nodes, Webhooks, Triggers, Options } from './Steps';
import { Form } from 'components/common';
import { Display } from 'styles';

const steps = [Initial, Nodes, Webhooks, Triggers, Options];

const AddAlgorithmForm = ({ onSubmit, form, isLastStep, step }) => {
  const { validateFields } = form;

  const onFormSubmit = e => {
    e.preventDefault();

    if (!isLastStep) return;
    validateFields((err, formObject) => {
      onSubmit();
    });
  };

  return (
    <Form onSubmit={onFormSubmit}>
      {steps.map((Step, index) => (
        <Display key={index} isVisible={step === index}>
          <Step {...form} />
        </Display>
      ))}
    </Form>
  );
};

AddAlgorithmForm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  step: PropTypes.number.isRequired
};

export default Form.create()(AddAlgorithmForm);
