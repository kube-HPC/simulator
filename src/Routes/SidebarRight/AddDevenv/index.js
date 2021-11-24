import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Input, Icon, Form, Button, Radio } from 'antd';
import { BottomContent } from 'components/common';
import { DRAWER_SIZE } from 'const';
import { selectors } from 'reducers';
import { useActions } from 'hooks';
import { FormItem } from './styles';

/** @type {import('antd/lib/upload/interface').UploadFile[]} */

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 15 },
};

const AddDevenv = ({ form }) => {
  const { getFieldDecorator, validateFields } = form;
  const { createDevenv } = useActions();

  const SubmittingStatus = useSelector(selectors.dataSources.createStatus);
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      validateFields((err, formObject) => {
        if (err) return;
        const payload = {
          name: formObject.name,
          type: formObject.type,
        };
        createDevenv(payload);
      });
    },
    [validateFields, createDevenv]
  );

  return (
    <Form
      {...formItemLayout}
      onSubmit={onSubmit}
      layout="horizontal"
      style={{ overflow: 'auto', maxHeight: '90vh' }}>
      <FormItem label="Name">
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: 'Please insert a name',
            },
          ],
        })(
          <Input
            prefix={<Icon type="database" />}
            placeholder="name"
            required
          />
        )}
      </FormItem>
      {/* -------------------------- git -------------------------- */}
      <FormItem label="Type">
        {getFieldDecorator('type', { initialValue: 'jupyter' })(
          <Radio.Group>
            <Radio.Button value="jupyter">
              <Icon type="github" /> Jupyter
            </Radio.Button>
            <Radio.Button value="vscode">
              <Icon type="vscode" /> VSCode
            </Radio.Button>
          </Radio.Group>
        )}
      </FormItem>
      <BottomContent.Divider />
      <BottomContent width={DRAWER_SIZE.ADD_DATASOURCE}>
        <Button
          key="Submit"
          type="primary"
          onClick={onSubmit}
          loading={SubmittingStatus === 'PENDING'}>
          Create
        </Button>
      </BottomContent>
    </Form>
  );
};
AddDevenv.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
};
export default Form.create({ name: 'create-devenv' })(AddDevenv);
