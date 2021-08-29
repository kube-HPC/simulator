import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button } from 'antd';
import styled from 'styled-components';
import useWizardContext from 'Routes/SidebarRight/AddPipeline/useWizardContext';
import useIds from '../useIds';
import InputField from './InputField';

const ButtonGroupCenter = styled(Button.Group)`
  display: flex;
  justify-content: center;
  margin-top: 5px;
`;

const Controller = ({ nodeIdx }) => {
  const { initialState } = useWizardContext();

  const [ids, appendKey, dropKey] = useIds(
    Object.keys(initialState.nodes[nodeIdx]?.input ?? {})
  );

  return (
    <>
      {ids.map(id => (
        <Form.Item
          name={['nodes', nodeIdx, 'input', id]}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: true,

              message: "Please input algorithm's name or delete this field.",
            },
          ]}>
          <InputField onRemove={ids.length > 1 ? dropKey : null} idx={id} />
        </Form.Item>
      ))}

      <ButtonGroupCenter>
        <Button block icon={<PlusOutlined />} type="dashed" onClick={appendKey}>
          Add Input
        </Button>
      </ButtonGroupCenter>
    </>
  );
};

Controller.propTypes = {
  nodeIdx: PropTypes.node.isRequired,
};

export default Controller;
