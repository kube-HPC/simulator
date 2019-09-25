import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Input, Icon, Form, Button } from 'antd';

import { addAlgorithm } from 'actions/debug.action';
import { DRAWER_SIZE } from 'const';
import { BottomContent } from 'components/common';
import { algorithmModalTemplate } from 'config';

function AddDebug() {
  const [algoData, setAlgoData] = useState(algorithmModalTemplate);

  const dispatch = useDispatch();
  const onSubmit = () => dispatch(addAlgorithm(algoData));

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
      <BottomContent.Divider />
      <BottomContent width={DRAWER_SIZE.ADD_DEBUG}>
        <Button key="Submit" type="primary" onClick={onSubmit}>
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
