import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Button, Card, Col, Divider, Form, Input, Row } from 'antd';
import KeyValueForm from 'components/common/KeyValueForm';
import PropTypes from 'prop-types';
import React from 'react';
import VolumeMountsList from './VolumeMountsList';

const FlexItem = styled.div`
  display: flex;
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
            <div>
              <MinusCircleOutlined
                style={{ fontSize: '20px', height: '32px', textAlign: 'end' }}
                onClick={() => remove(name)}
              />
            </div>
            <FlexItem>
              <ContainerFormItemTop
                style={{ width: '100%' }}
                label="Name"
                {...restField}
                name={[name, 'container', 'name']}
                rules={[{ required: true, message: 'Missing container Name' }]}>
                <Input />
              </ContainerFormItemTop>
            </FlexItem>
            <ContainerFormItemTop
              label="Image"
              {...restField}
              name={[name, 'container', 'image']}
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

            <Card title="Volumes Mounts" bordered="true">
              <Form.Item>
                <VolumeMountsList nameList={[name, 'volumesMounts']} />
              </Form.Item>
            </Card>

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
