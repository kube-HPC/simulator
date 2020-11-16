import React from 'react';
import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';
import { Input, Icon, Form, Button } from 'antd';
import { BottomContent } from 'components/common';
import { DRAWER_SIZE } from 'const';

const AddDataSource = ({ form }) => {
  const { getFieldDecorator, validateFields } = form;
  //   const dispatch = useDispatch();

  const onSubmit = e => {
    e.preventDefault();
    validateFields((err, formObject) => {
      if (err) return;
      console.log(formObject);
      //   dispatch(addAlgorithm(formObject.debugImage));
    });
  };
  return (
    <Form onSubmit={onSubmit} layout="vertical">
      <Form.Item label="DataSource Name">
        {getFieldDecorator('dataSource name')(
          <Input prefix={<Icon type="database" />} placeholder="DataSource" />
        )}
      </Form.Item>
      <BottomContent.Divider />
      <BottomContent width={DRAWER_SIZE.ADD_DATASOURCE}>
        <Button key="Submit" type="primary" onClick={onSubmit}>
          Confirm
        </Button>
      </BottomContent>
    </Form>
  );
};
AddDataSource.propTypes = {
  // eslint-disable-next-line
  form: PropTypes.any.isRequired,
};
export default Form.create()(AddDataSource);
