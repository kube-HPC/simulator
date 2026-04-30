import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Button, Divider, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const FlexItem = styled.div`
  display: flex;
`;
const ContainerFormItem = styled(Form.Item)`
  & .ant-row {
    width: 100%;
    & .ant-form-item-label {
      width: 35%;
    }
    & div {
      display: flex;
    }
  }
`;

const VolumeMountsList = ({
  nameList,
  testIdPrefix = 'add-algorithm-volume-mount',
}) => (
  <Form.List name={nameList}>
    {(
      fieldsVolumeMounts,
      { add: addVolumeMounts, remove: removeVolumeMounts }
    ) => (
      <>
        {fieldsVolumeMounts.map(({ key, name, ...rest }) => (
          <React.Fragment key={key}>
            <MinusCircleOutlined
              data-testid={`${testIdPrefix}-remove-${name}`}
              title="delete volumes"
              onClick={() => removeVolumeMounts(name)}
              style={{
                position: 'absolute',
                right: '-20px',
                marginTop: '-20px',
              }}
            />

            <FlexItem>
              <div style={{ width: '100%' }}>
                <ContainerFormItem
                  style={{ width: '100%' }}
                  label="Volume Mount Name"
                  {...rest}
                  name={[name, 'name']}>
                  <Input data-testid={`${testIdPrefix}-name-${name}`} />
                </ContainerFormItem>

                <ContainerFormItem
                  label="Mount Path"
                  {...rest}
                  name={[name, 'mountPath']}>
                  <Input data-testid={`${testIdPrefix}-mount-path-${name}`} />
                </ContainerFormItem>
              </div>
            </FlexItem>
            <Divider />
          </React.Fragment>
        ))}
        <Form.Item>
          <Button
            data-testid={`${testIdPrefix}-add-button`}
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

export default VolumeMountsList;

VolumeMountsList.propTypes = {
  nameList: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
  testIdPrefix: PropTypes.string,
};
