import React, { Component } from 'react';
import { Icon, Modal, Button } from 'antd';

import JsonEditor from './JsonEditor.react';

class PipeAdd extends Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <div>
        <Button
          className="Add-Pipe"
          type="primary"
          size="default"
          style={{
            color: 'white',
            fontSize: '15px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            letterSpacing: '1px',
            backgroundColor: '#4da0ee'
          }}
          onClick={this.showModal}>
          <Icon
            type="plus"
            style={{
              fontSize: 15,
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}/>{' '}
          | PIPE
        </Button>
        <Modal
          title="Add-Pipeline"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="800px"
          okText="Add Pipe"
          cancelText="Cancel">
          <JsonEditor/>
          <p/>
          <p>
            Use <code>addn</code> <strong>snippet</strong> for adding{' '}
            <strong>pipe-node</strong>. Use <code>Ctrl+Space</code> for{' '}
            <strong>auto-completion</strong>.
          </p>
        </Modal>
      </div>
    );
  }
}

export default PipeAdd;
