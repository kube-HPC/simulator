import React from 'react';
import { useDispatch } from 'react-redux';
import { Input, Icon, Form, Button } from 'antd';

import { addAlgorithm } from 'actions/debug.action';
import { DRAWER_SIZE } from 'const';
import { BottomContent } from 'components/common';

function AddDebug({ form }) {
  const { getFieldDecorator, validateFields } = form;
  const dispatch = useDispatch();

  const onSubmit = e => {
    e.preventDefault();
    validateFields((err, formObject) => {
      if (err) return;
      dispatch(addAlgorithm(formObject.debugImage));
    });
  };

  return (
    <>
      <Form onSubmit={onSubmit} layout="vertical">
        <Form.Item label="Image URL">
          {getFieldDecorator('debugImage')(
            <Input prefix={<Icon type="share-alt" />} placeholder="Algorithm" />
          )}
        </Form.Item>
      </Form>
      <BottomContent.Divider />
      <BottomContent width={DRAWER_SIZE.ADD_DEBUG}>
        <Button key="Submit" type="primary" onClick={onSubmit}>
          Confirm
        </Button>
      </BottomContent>
    </>
  );
}

AddDebug.propTypes = Form.propTypes;

export default Form.create()(AddDebug);
