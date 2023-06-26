import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { Form } from 'components/common';
import { splitByDot } from 'utils';
import schema from '../schema';
import SelectEnvOptions from '../SelectEnvOptions.react';
import AlgorithmUploadFile from '../AlgorithmUploadFile';

const marginTop = { marginTop: 15 };

const {
  CODE: { ENVIRONMENT, ENTRY_POINT, BASE_IMAGE, DIVIDERS },
} = schema.BUILD_TYPES;

const CodeBuild = ({ required, fileList, setFileList, isEdit }) => (
  <>
    <Form.Divider>{DIVIDERS.BUILD}</Form.Divider>
    <Form.Item
      name={splitByDot(ENVIRONMENT.field)}
      label={ENVIRONMENT.label}
      rules={[{ required, message: ENVIRONMENT.message }]}>
      <SelectEnvOptions placeholder={ENVIRONMENT.placeholder} />
    </Form.Item>
    <Form.Item
      name={splitByDot(ENTRY_POINT.field)}
      label={ENTRY_POINT.label}
      rules={[{ required, message: ENTRY_POINT.message }]}>
      <Input placeholder={ENTRY_POINT.placeholder} />
    </Form.Item>
    <Form.Item label={BASE_IMAGE.label} name={splitByDot(BASE_IMAGE.field)}>
      <Input
        disabled={isEdit && fileList.length === 0}
        placeholder={BASE_IMAGE.placeholder}
      />
    </Form.Item>

    <Form.Item wrapperCol={null} style={marginTop}>
      <AlgorithmUploadFile
        fileList={fileList}
        setFileList={setFileList}
        isEdit={isEdit}
      />
    </Form.Item>
  </>
);

CodeBuild.propTypes = {
  required: PropTypes.bool.isRequired,
  setFileList: PropTypes.func.isRequired,
  // TODO: detail the props
  // eslint-disable-next-line
  fileList: PropTypes.array.isRequired,
  isEdit: PropTypes.bool.isRequired,
};

export default CodeBuild;
