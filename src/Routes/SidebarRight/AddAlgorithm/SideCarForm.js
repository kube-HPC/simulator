import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Button, Card, Col, Divider, Form, Input, Radio, Row } from 'antd';
import KeyValueForm from 'components/common/KeyValueForm';
import PropTypes from 'prop-types';
import React from 'react';

const FlexItem = styled.div`
  display: flex;
`;

const ContainerFormItem = styled(Form.Item)`
  & .ant-row {
    width: 100%;
    & .ant-form-item-label {
      width: 30%;
    }
    & div {
      display: flex;
    }
  }
`;

const ContainerFormItemTop = styled(Form.Item)`
  & .ant-row {
    width: 100%;
    & .ant-form-item-label {
      width: 21%;
    }
    & div {
      display: flex;
    }
  }
`;

const SideCarForm = ({ nameList }) => (
  <Form.List name={nameList}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <React.Fragment key={key}>
            <FlexItem>
              <ContainerFormItemTop
                style={{ width: '100%' }}
                label="Name"
                {...restField}
                name={[name, 'containerName']}
                rules={[{ required: true, message: 'Missing container Name' }]}>
                <Input />
              </ContainerFormItemTop>
              <MinusCircleOutlined
                style={{ marginLeft: 'px', marginTop: '-6px' }}
                onClick={() => remove(name)}
              />
            </FlexItem>
            <ContainerFormItemTop
              label="Image"
              {...restField}
              name={[name, 'containerImage']}
              rules={[{ required: true, message: 'Missing container Image' }]}>
              <Input />
            </ContainerFormItemTop>
            <Row style={{ marginTop: '16px' }}>
              <Col span={24}>
                <Card title="Environment Variable" bordered="true">
                  <Form.Item>
                    <KeyValueForm
                      buttonWidth="395px"
                      fieldName={[name, 'environments']}
                      titleButtoAdd="Add"
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '16px' }}>
              <Col span={12}>
                <Card title="Volumes" bordered="true">
                  <Form.Item>
                    <VolumeList nameList={[name, 'volumes']} />
                  </Form.Item>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Volumes Mounts" bordered="true">
                  <Form.Item>
                    <VolumeMountsList nameList={[name, 'volumesMounts']} />
                  </Form.Item>
                </Card>
              </Col>
            </Row>

            <Divider style={{ borderWidth: '7px' }} />
          </React.Fragment>
        ))}

        <Form.Item>
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}>
            Add Sidecar
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

export default SideCarForm;
SideCarForm.propTypes = {
  nameList: PropTypes.string.isRequired,
};

const VolumeList = ({ nameList }) => (
  <Form.List name={nameList}>
    {(fieldsVolumeList, { add: addVolume, remove: removeVolume }) => (
      <>
        {fieldsVolumeList.map(({ key, name, ...rest }) => (
          <React.Fragment key={key}>
            <FlexItem>
              <Form.Item {...rest} name={[name, 'typeVolume']}>
                <Radio.Group defaultValue="emptyDir">
                  <Radio.Button value="emptyDir">EmptyDir</Radio.Button>
                  <Radio.Button value="persistentVolumeClaim">
                    persistentVolumeClaim (PVC)
                  </Radio.Button>
                  <Radio.Button value="configMap">ConfigMap</Radio.Button>
                  <Radio.Button value="secret">Secret</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <MinusCircleOutlined
                style={{ marginLeft: '20px', marginTop: '-6px' }}
                onClick={() => removeVolume(name)}
              />
            </FlexItem>
            <ContainerFormItem label="Name" {...rest} name={[name, 'name']}>
              <Input />
            </ContainerFormItem>

            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const selectVolume =
                  getFieldValue([
                    'main',
                    'sideCars',
                    ...nameList,
                    name,
                    'typeVolume',
                  ]) ?? 'emptyDir';

                return (
                  <>
                    {selectVolume === 'emptyDir' && (
                      <ContainerFormItem
                        label="Empty Dir"
                        {...rest}
                        name={[name, 'emptyDir']}>
                        <Input />
                      </ContainerFormItem>
                    )}

                    {selectVolume === 'persistentVolumeClaim' && (
                      <ContainerFormItem
                        label="Persistent Volume Claim"
                        {...rest}
                        name={[name, 'persistentVolumeClaim', 'claimName']}>
                        <Input />
                      </ContainerFormItem>
                    )}

                    {selectVolume === 'configMap' && (
                      <ContainerFormItem
                        label="Config Map"
                        {...rest}
                        name={[name, 'configMap', 'name']}>
                        <Input />
                      </ContainerFormItem>
                    )}

                    {selectVolume === 'secret' && (
                      <ContainerFormItem
                        label="Secret"
                        {...rest}
                        name={[name, 'secret', 'secretName']}>
                        <Input />
                      </ContainerFormItem>
                    )}
                  </>
                );
              }}
            </Form.Item>
            <Divider />
          </React.Fragment>
        ))}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => addVolume()}
            block
            icon={<PlusOutlined />}>
            Add Volume
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

const VolumeMountsList = ({ nameList }) => (
  <Form.List name={nameList}>
    {(
      fieldsVolumeMounts,
      { add: addVolumeMounts, remove: removeVolumeMounts }
    ) => (
      <>
        {fieldsVolumeMounts.map(({ key, name, ...rest }) => (
          <React.Fragment key={key}>
            <FlexItem>
              <div style={{ width: '100%' }}>
                <ContainerFormItem
                  style={{ width: '100%' }}
                  label="Volume Mount Name"
                  {...rest}
                  name={[name, 'name']}>
                  <Input />
                </ContainerFormItem>

                <ContainerFormItem
                  label="Mount Path"
                  {...rest}
                  name={[name, 'mountPath']}>
                  <Input />
                </ContainerFormItem>
              </div>
              <MinusCircleOutlined
                style={{ marginLeft: '5px' }}
                onClick={() => removeVolumeMounts(name)}
              />
            </FlexItem>
            <Divider />
          </React.Fragment>
        ))}
        <Form.Item>
          <Button
            type="dashed"
            onClick={() => addVolumeMounts()}
            block
            icon={<PlusOutlined />}>
            Add Volume Mount
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
);

VolumeList.propTypes = {
  nameList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};
VolumeMountsList.propTypes = {
  nameList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};
