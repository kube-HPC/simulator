import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Button, Divider, Form, Input, Radio } from 'antd';

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

const VolumeList = ({ nameList }) => (
  <Form.List name={nameList}>
    {(fieldsVolumeList, { add: addVolume, remove: removeVolume }) => (
      <>
        {fieldsVolumeList.map(({ key, name, ...rest }) => (
          <React.Fragment key={key}>
            <MinusCircleOutlined
              title="delete volumes"
              onClick={() => removeVolume(name)}
              style={{
                position: 'absolute',
                right: '-20px',
                marginTop: '-20px',
              }}
            />

            <FlexItem>
              <div style={{ width: '100%' }}>
                <ContainerFormItem label="Name" {...rest} name={[name, 'name']}>
                  <Input />
                </ContainerFormItem>

                <FlexItem>
                  <Form.Item {...rest} name={[name, 'typeVolume']}>
                    <Radio.Group defaultValue="emptyDir" buttonStyle="solid">
                      <Radio.Button value="emptyDir">EmptyDir</Radio.Button>
                      <Radio.Button value="persistentVolumeClaim">
                        persistentVolumeClaim (PVC)
                      </Radio.Button>
                      <Radio.Button value="configMap">ConfigMap</Radio.Button>
                      <Radio.Button value="secret">Secret</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </FlexItem>

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
                            label="Value"
                            {...rest}
                            name={[name, 'emptyDir']}>
                            <Input />
                          </ContainerFormItem>
                        )}

                        {selectVolume === 'persistentVolumeClaim' && (
                          <ContainerFormItem
                            label="Value"
                            {...rest}
                            name={[name, 'persistentVolumeClaim', 'claimName']}>
                            <Input />
                          </ContainerFormItem>
                        )}

                        {selectVolume === 'configMap' && (
                          <ContainerFormItem
                            label="Value"
                            {...rest}
                            name={[name, 'configMap', 'name']}>
                            <Input />
                          </ContainerFormItem>
                        )}

                        {selectVolume === 'secret' && (
                          <ContainerFormItem
                            label="Value"
                            {...rest}
                            name={[name, 'secret', 'secretName']}>
                            <Input />
                          </ContainerFormItem>
                        )}
                      </>
                    );
                  }}
                </Form.Item>
              </div>{' '}
            </FlexItem>
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

export default VolumeList;

VolumeList.propTypes = {
  nameList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};
