import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Icon, Form, Button, Card, Typography } from 'antd';

import { addAlgorithm } from 'actions/debugTable.action';
import template from 'config/template/algorithm-modal.template';
import BottomContent from 'components/dumb/BottomContent.react';

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

const mapStateToProps = () => {};

export default connect(
  mapStateToProps,
  { addAlgorithm }
)(AddDebug);
