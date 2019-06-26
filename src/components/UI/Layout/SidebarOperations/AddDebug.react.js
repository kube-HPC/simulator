import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Input, Icon, Form, Button } from 'antd';

import { addAlgorithm } from 'actions/debug.action';
import template from 'config/template/algorithm-modal.template';
import BottomContent from 'components/common/drawer/BottomContent.react';

function AddDebug({ onSubmit }) {
  const [algoData, setAlgoData] = useState(template);

  const dispatch = useDispatch();

  return (
    <>
      <Form>
        <Form.Item>
          <Input
            onChange={e => setAlgoData(e.target.value)}
            prefix={<Icon type="share-alt" />}
            placeholder="Algorithm"
          />
        </Form.Item>
      </Form>
      <BottomContent>
        <Button
          key="Submit"
          type="primary"
          onClick={() => {
            dispatch(addAlgorithm(algoData));
            onSubmit();
          }}
        >
          Confirm
        </Button>
      </BottomContent>
    </>
  );
}

AddDebug.propsTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default AddDebug;
