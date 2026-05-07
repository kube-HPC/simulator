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

const VolumeList = ({ nameList, testIdPrefix = 'add-algorithm-volume' }) => (
  <Form.List name={nameList}>
    {(fieldsVolumeList, { add: addVolume, remove: removeVolume }) => (
      <>
        {fieldsVolumeList.map(({ key, name, ...rest }) => (
          <React.Fragment key={key}>
            <MinusCircleOutlined
              data-testid={`${testIdPrefix}-remove-${name}`}
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
                  <Input data-testid={`${testIdPrefix}-name-${name}`} />
                </ContainerFormItem>

                <FlexItem>
                  <Form.Item
                    {...rest}
                    name={[name, 'typeVolume']}
                    initialValue="emptyDir">
                    <Radio.Group
                      buttonStyle="solid"
                      data-testid={`${testIdPrefix}-type-${name}`}>
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
                      getFieldValue([...nameList, name, 'typeVolume']) ??
                      'emptyDir';

                    return (
                      <>
                        {selectVolume === 'emptyDir' && (
                          <ContainerFormItem
                            label="Value"
                            {...rest}
                            name={[name, 'emptyDir']}>
                            <Input
                              data-testid={`${testIdPrefix}-value-empty-dir-${name}`}
                            />
                          </ContainerFormItem>
                        )}

                        {selectVolume === 'persistentVolumeClaim' && (
                          <ContainerFormItem
                            label="Value"
                            {...rest}
                            name={[name, 'persistentVolumeClaim', 'claimName']}>
                            <Input
                              data-testid={`${testIdPrefix}-value-pvc-${name}`}
                            />
                          </ContainerFormItem>
                        )}

                        {selectVolume === 'configMap' && (
                          <ContainerFormItem
                            label="Value"
                            {...rest}
                            name={[name, 'configMap', 'name']}>
                            <Input
                              data-testid={`${testIdPrefix}-value-config-map-${name}`}
                            />
                          </ContainerFormItem>
                        )}

                        {selectVolume === 'secret' && (
                          <ContainerFormItem
                            label="Value"
                            {...rest}
                            name={[name, 'secret', 'secretName']}>
                            <Input
                              data-testid={`${testIdPrefix}-value-secret-${name}`}
                            />
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
            data-testid={`${testIdPrefix}-add-button`}
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
  nameList: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  testIdPrefix: PropTypes.string,
};
