import React from 'react';
import { Form, Input, Button, Divider, Radio } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import KeyValueForm from 'components/common/KeyValueForm';
import PropTypes from 'prop-types';

const SideCarForm = ({ nameList }) => (
  <Form.List name={nameList}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <React.Fragment key={key}>
            <Form.Item
              label="Name"
              {...restField}
              name={[name, 'name']}
              rules={[{ required: true, message: 'Missing name' }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Container Name"
              {...restField}
              name={[name, 'containerName']}
              rules={[{ required: true, message: 'Missing container name' }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Container Image"
              {...restField}
              name={[name, 'containerImage']}>
              <Input />
            </Form.Item>

            <Form.Item label="volumes">
              <VolumeList nameList={[name, 'volumes']} />
            </Form.Item>

            <Form.Item label="volumes Mounts">
              <VolumeMountsList nameList={[name, 'volumesMounts']} />
            </Form.Item>

            <Form.Item label="Environments">
              <KeyValueForm
                buttonWidth="395px"
                fieldName={[name, 'environments']}
                titleButtoAdd="Add"
              />
            </Form.Item>

            <MinusCircleOutlined onClick={() => remove(name)} />

            <Divider />
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

            <Form.Item label="Name" {...rest} name={[name, 'name']}>
              <Input />
            </Form.Item>

            <Form.Item shouldUpdate>
              {({ getFieldValue }) => {
                const selectVolume =
                  getFieldValue([
                    'main',
                    'sideCar',
                    ...nameList,
                    name,
                    'typeVolume',
                  ]) ?? 'emptyDir';

                return (
                  <>
                    {selectVolume === 'emptyDir' && (
                      <Form.Item
                        label="Empty Dir"
                        {...rest}
                        name={[name, 'emptyDir']}>
                        <Input />
                      </Form.Item>
                    )}

                    {selectVolume === 'persistentVolumeClaim' && (
                      <Form.Item
                        label="Persistent Volume Claim"
                        {...rest}
                        name={[name, 'persistentVolumeClaim', 'claimName']}>
                        <Input />
                      </Form.Item>
                    )}

                    {selectVolume === 'configMap' && (
                      <Form.Item
                        label="Config Map"
                        {...rest}
                        name={[name, 'configMap', 'name']}>
                        <Input />
                      </Form.Item>
                    )}

                    {selectVolume === 'secret' && (
                      <Form.Item
                        label="Secret"
                        {...rest}
                        name={[name, 'secret', 'secretName']}>
                        <Input />
                      </Form.Item>
                    )}
                  </>
                );
              }}
            </Form.Item>

            <MinusCircleOutlined onClick={() => removeVolume(name)} />
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
            <Form.Item
              label="Volume Mount Name"
              {...rest}
              name={[name, 'name']}>
              <Input />
            </Form.Item>
            <Form.Item label="Mount Path" {...rest} name={[name, 'mountPath']}>
              <Input />
            </Form.Item>
            <MinusCircleOutlined onClick={() => removeVolumeMounts(name)} />
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
