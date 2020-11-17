import React, { useCallback, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Input, Icon, Form, Button, Typography, Alert, Upload } from 'antd';
import styled from 'styled-components';
import { BottomContent } from 'components/common';
import { createDataSource } from 'actions/dataSources';
import { DRAWER_SIZE } from 'const';
import { COLOR } from 'styles';
import { notification } from 'utils';
import ctx from './../ctx';

const { Text } = Typography;

// #region helpers
const toStatusMessage = fileName => ({
  done: `${fileName} uploaded successfully`,
  error: `${fileName} upload failed`,
  removed: `File ${fileName} removed`,
});

const STATUS_TYPE = {
  done: notification.TYPES.SUCCESS,
  error: notification.TYPES.ERROR,
  removed: notification.TYPES.INFO,
};

const DraggerContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const DraggerDescription = styled.p`
  margin-top: 0.5em !important;
  margin-bottom: 1em !important;
  display: flex;
  flex-direction: column;
`;

const shouldNotify = status => ['error', 'removed'].includes(status);

const AddDataSource = ({ form }) => {
  const context = useContext(ctx);
  const { getFieldDecorator, validateFields } = form;
  const dispatch = useDispatch();

  const [fileList, setFileList] = useState([]);
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      validateFields((err, formObject) => {
        if (err) return;
        dispatch(
          createDataSource(
            { ...formObject, files: fileList },
            { onSuccess: context.closeDrawer }
          )
        );
      });
    },
    [dispatch, validateFields, fileList, context]
  );

  const customRequest = useCallback(
    ({ file, onSuccess }) => {
      setFileList(fileList.concat(file));
      onSuccess(file.name);
    },
    [fileList, setFileList]
  );

  const onChange = useCallback(
    info => {
      const { status, response: fileName } = info.file;
      if (shouldNotify(status)) {
        notification({
          message: toStatusMessage(fileName)[status],
          type: STATUS_TYPE[status],
        });
      }
      if (status === 'removed') {
        setFileList(fileList.filter(item => item !== info.file));
      }
    },
    [setFileList, fileList]
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
        <Upload.Dragger
          multiple
          name="files"
          accept="*"
          customRequest={customRequest}
          fileList={fileList}
          onChange={onChange}>
          <DraggerContent>
            <Icon
              type="inbox"
              style={{ fontSize: 50, color: COLOR.blueLight }}
            />
            <DraggerDescription>
              <Text>Click or drag files to upload</Text>
              <Text type="secondary">all file types are supported</Text>
            </DraggerDescription>
            <Alert
              message={
                fileList.length
                  ? fileList.length === 1
                    ? '1 file to upload'
                    : `${fileList.length} files to upload`
                  : 'please select at least one file to upload'
              }
              type={fileList.length ? 'info' : 'warning'}
              showIcon
            />
          </DraggerContent>
        </Upload.Dragger>
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
