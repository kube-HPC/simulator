import React, { useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Input, Icon, Form, Button, Alert } from 'antd';
import { BottomContent } from 'components/common';
import { createDataSource } from 'actions/dataSources';
import UploadDragger, { useDragger } from 'components/UploadDragger';
import { DRAWER_SIZE } from 'const';
import ctx from './../ctx';

/** @type {import('antd/lib/upload/interface').UploadFile[]} */
const initialState = [];

const AddDataSource = ({ form }) => {
  const context = useContext(ctx);
  const { getFieldDecorator, validateFields } = form;
  const dispatch = useDispatch();

  const [addedFiles, setAddedFiles] = useState(initialState);
  const { onChange, customRequest } = useDragger({
    setFileList: setAddedFiles,
  });

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      validateFields((err, formObject) => {
        if (err) return;
        dispatch(
          createDataSource(
            { ...formObject, files: addedFiles },
            { onSuccess: context.closeDrawer }
          )
        );
      });
    },
    [dispatch, validateFields, addedFiles, context]
  );

  return (
    <Form onSubmit={onSubmit} layout="vertical">
      <Form.Item label="DataSource Name">
        {getFieldDecorator('name')(
          <Input
            prefix={<Icon type="database" />}
            placeholder="DataSource"
            required
          />
        )}
      </Form.Item>
      <Form.Item wrapperCol={null}>
        <UploadDragger
          onChange={onChange}
          fileList={addedFiles}
          customRequest={customRequest}>
          <Alert
            message={
              addedFiles.length
                ? addedFiles.length === 1
                  ? '1 file to upload'
                  : `${addedFiles.length} files to upload`
                : 'please select at least one file to upload'
            }
            type={addedFiles.length ? 'info' : 'warning'}
            showIcon
          />
        </UploadDragger>
      </Form.Item>
      <BottomContent.Divider />
      <BottomContent width={DRAWER_SIZE.ADD_DATASOURCE} extra={[]}>
        <Button key="Submit" type="primary" onClick={onSubmit}>
          Create
        </Button>
      </BottomContent>
    </Form>
  );
};
AddDataSource.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
};
export default Form.create()(AddDataSource);
