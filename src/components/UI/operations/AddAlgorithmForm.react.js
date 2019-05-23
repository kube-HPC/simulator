import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import template from 'config/template/algorithm-modal.template';
import schema from 'config/schema/algorithm-modal.schema';
import { toUpperCaseFirstLetter } from 'utils/string';
import {
  Input,
  Icon,
  Select,
  InputNumber,
  Upload,
  Divider,
  Form,
  Row,
  Col,
  Button,
  Radio
} from 'antd';

import parseUnit from 'parse-unit';
import PropTypes from 'prop-types';

import { applyAlgorithm } from 'actions/algorithmTable.action';
import BottomContent from 'components/dumb/BottomContent.react';

const Option = Select.Option;

const _parseUnit = obj => {
  const [val, unit] = parseUnit(obj);
  return { val, unit };
};

const insertAlgorithmOptions = options =>
  Object.entries(options).map(([key]) => (
    <Option key={key.toString()} value={key}>
      {toUpperCaseFirstLetter(key)}
    </Option>
  ));

const insertEnvOptions = options =>
  Object.entries(options).map(([key, value]) => (
    <Option key={key} value={key}>
      {value}
    </Option>
  ));

const availableOptions = options =>
  Object.entries(options)
    .filter(([, value]) => value)
    .map(([key]) => key);

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
  labelAlign: 'left'
};

const getMemValue = (mem, isReturnUnit) => {
  const { val, unit } = _parseUnit(mem);
  return isReturnUnit ? unit : val;
};

const insertRadioButtons = buildTypes =>
  Object.entries(buildTypes).map(([type]) => (
    <Radio.Button key={type} value={type}>
      {toUpperCaseFirstLetter(type)}
    </Radio.Button>
  ));

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 0px;
  }
`;

function AddAlgorithmForm(props) {
  const [algoData, setAlgoData] = useState(template);
  const [buildType, setBuildType] = useState('code');
  const [file, setFile] = useState(undefined);

  const dragProps = {
    name: 'file',
    multiple: false,
    accept: '.zip,.tar.gz',
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        setFile(file);
        onSuccess('OK');
      }, 0);
    },
    onChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        console.log(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        console.log(`${info.file.name} file upload failed.`);
      }
    }
  };

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('payload', JSON.stringify(algoData));
    props.applyAlgorithm(formData);
    props.onSubmit();
  };

  const buildTypes = {
    code: (
      <div>
        <Form.Item {...formItemLayout} label={schema.environment}>
          <Select
            defaultValue={algoData.env}
            value={algoData.env}
            onChange={v => (algoData.env = v)}
          >
            {insertEnvOptions(schema.env)}
          </Select>
        </Form.Item>
        <Form.Item {...formItemLayout} label={schema.entryPoint}>
          <Input
            defaultValue={algoData.entryPoint}
            value={algoData.entryPoint}
            onChange={e =>
              setAlgoData({ ...algoData, entryPoint: e.target.value })
            }
            prefix={<Icon type="login" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Insert Entry Point"
          />
        </Form.Item>
        <Form.Item style={{ marginTop: '15px' }}>
          <Upload.Dragger {...dragProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              Click or drag algorithm source code to this area to upload
            </p>
            <p className="ant-upload-hint">Support for zip or tar.gz only</p>
          </Upload.Dragger>
        </Form.Item>
      </div>
    ),
    image: (
      <Form.Item {...formItemLayout} label={schema.image}>
        <Input
          className="input"
          value={algoData.algorithmImage}
          onChange={e =>
            setAlgoData({ ...algoData, algorithmImage: e.target.value })
          }
          prefix={
            <Icon type="share-alt" style={{ color: 'rgba(0,0,0,.25)' }} />
          }
          placeholder="Insert algorithm image"
        />
      </Form.Item>
    )
  };

  return (
    <>
      <StyledForm>
        <Form.Item {...formItemLayout} label={schema.name}>
          <Input
            className="input"
            value={algoData.name}
            onChange={e => setAlgoData({ ...algoData, name: e.target.value })}
            prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Insert algorithm name"
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label="Build Type">
          <Radio.Group
            defaultValue={buildType}
            buttonStyle="solid"
            onChange={v => setBuildType(v.target.value)}
          >
            {insertRadioButtons(buildTypes)}
          </Radio.Group>
        </Form.Item>
        <Divider orientation="left">{schema.resources}</Divider>
        <Form.Item {...formItemLayout} label={schema.cpu}>
          <InputNumber
            min={1}
            value={algoData.cpu}
            defaultValue={algoData.cpu}
            onChange={v => setAlgoData({ ...algoData, cpu: +v })}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label={schema.gpu}>
          <InputNumber
            min={0}
            value={algoData.gpu}
            defaultValue={algoData.gpu}
            onChange={v => setAlgoData({ ...algoData, gpu: +v })}
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label={schema.memory} labelAlign="left">
          <Row type="flex" justify="start" gutter={4}>
            <Col>
              <InputNumber
                min={1}
                value={getMemValue(algoData.mem)}
                onChange={v => {
                  const { unit } = _parseUnit(algoData.mem);
                  setAlgoData({ ...algoData, mem: v + unit });
                }}
              />
            </Col>
            <Col>
              <Select
                value={getMemValue(algoData.mem, true)}
                style={{ width: '90px' }}
                onChange={v => {
                  const { val } = _parseUnit(algoData.mem);
                  setAlgoData({ ...algoData, mem: val + v });
                }}
              >
                {schema.memoryType.map(value => (
                  <Option key={value} value={value}>
                    {value}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Form.Item>
        <Divider orientation="left">{schema.advanced}</Divider>
        <Form.Item {...formItemLayout} label={schema.minHotWorkers}>
          <InputNumber
            min={0}
            value={algoData.minHotWorkers}
            onChange={minHotWorkers =>
              setAlgoData({ ...algoData, minHotWorkers: minHotWorkers })
            }
          />
        </Form.Item>
        <Form.Item {...formItemLayout} label={schema.options}>
          <Select
            className="input"
            defaultValue={availableOptions(algoData.options)}
            mode="tags"
            placeholder="Enable Options"
            onSelect={key =>
              setAlgoData({
                ...algoData,
                options: {
                  ...algoData.options,
                  [key]: !algoData.options[key]
                }
              })
            }
          >
            {insertAlgorithmOptions(algoData.options)}
          </Select>
        </Form.Item>
        <Divider orientation="left">{schema.code}</Divider>
        {buildTypes[buildType]}
      </StyledForm>
      <BottomContent>
        <Button key="Preview" disabled={true}>
          Preview
        </Button>
        <Button key="Submit" type="primary" onClick={onSubmit}>
          Submit
        </Button>
      </BottomContent>
    </>
  );
}

AddAlgorithmForm.propsTypes = {
  applyAlgorithm: PropTypes.func.isRequired
};

const mapStateToProps = () => {};

export default connect(
  mapStateToProps,
  { applyAlgorithm }
)(AddAlgorithmForm);
