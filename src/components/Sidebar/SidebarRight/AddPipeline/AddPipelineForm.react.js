/* eslint-disable */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

import { Initial, Nodes, Webhooks, Triggers, Options } from './Steps';
import { Form } from 'components/common';
import { Display } from 'styles';

const AddAlgorithmForm = ({ onSubmit, form, isLastStep }) => {
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
      <Initial {...form} />
      <Nodes />
      <Webhooks />
      <Triggers />
      <Options />
    </Form>
  );
};

AddAlgorithmForm.propTypes = {
  form: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLastStep: PropTypes.bool.isRequired
};

export default Form.create()(AddAlgorithmForm);
