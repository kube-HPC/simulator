import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
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
  const { form, initialState } = useWizardContext();
  const { getFieldDecorator } = form;
  const [ids, appendKey, dropKey] = useIds(
    Object.keys(initialState.nodes[nodeIdx]?.input ?? {})
  );

  return (
    <>
      {ids.map(id =>
        getFieldDecorator(`nodes.${nodeIdx}.input.${id}`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input algorithm's name or delete this field.",
            },
          ],
        })(<InputField onRemove={ids.length > 1 ? dropKey : null} idx={id} />)
      )}
      <ButtonGroupCenter>
        <Button block icon="plus" type="dashed" onClick={appendKey}>
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
