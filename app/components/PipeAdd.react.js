import React, { Component } from 'react';
import { Icon, Modal, Button } from 'antd';

import 'brace/mode/json';
import 'brace/theme/textmate';

import ReactMarkdown from 'react-markdown';
import JsonEditor from './JsonEditor.react';

// TODO: parse from file
const mdNotes =
  'For auto-complete use `Ctrl+Enter`.\n\nType `nodeadd` for node-adding snippet.\n';

class PipeAdd extends Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOK = () => {
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
          title="Add Pipeline"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="800px"
          okText="Add Pipe"
          cancelText="Cancel">
          <JsonEditor/>
          <ReactMarkdown source={mdNotes}/>
        </Modal>
      </div>
    );
  }
}

export default PipeAdd;
