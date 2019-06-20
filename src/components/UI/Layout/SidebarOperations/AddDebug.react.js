import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Icon, Form, Button } from 'antd';

import { addAlgorithm } from 'actions/debug.action';
import template from 'config/template/algorithm-modal.template';
import BottomContent from 'components/containers/drawer/BottomContent.react';

function AddDebug({ onSubmit, addAlgorithm }) {
  const [algoData, setAlgoData] = useState(template);

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
            addAlgorithm(algoData);
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
  addAlgorithm: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  null,
  { addAlgorithm }
)(AddDebug);
