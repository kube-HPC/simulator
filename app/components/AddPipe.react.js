import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Modal, Button } from 'antd';

import { addPipe } from '../actions/addpipe.action';

import JsonEditor from './JsonEditor.react';
import template from './lib/json-object.json';

const jsonTemplate = JSON.stringify(template, null, 2);

class PipeAdd extends Component {
  constructor() {
    super();
    this.pipe = jsonTemplate;
    this.saved = this.pipe;
  }
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleAddPipe = () => {
    addPipe(this.pipe);
    this.saved = this.pipe;
    this.setState({
      visible: false
    });
    // add post call
  };

  handleCancel = () => {
    this.saved = this.pipe;
    this.setState({
      visible: false
    });
  };

  handleSave = () => {
    this.saved = this.pipe;
    this.setState({
      visible: true
    });
  };

  handleReset = () => {
    this.pipe = jsonTemplate;
    this.saved = this.pipe;
    this.setState({
      visible: false
    });
    this.setState({
      visible: true
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
          onOk={this.handleAddPipe}
          onCancel={this.handleCancel}
          width="800px"
          footer={[
            <Button onClick={this.handleCancel}> Cancel</Button>,
            <Button onClick={this.handleReset}> Reset</Button>,
            <Button type="primary" size="default" onClick={this.handleAddPipe}>
              {' '}
              Add Pipe
            </Button>
          ]}>
          <JsonEditor
            jsonTemplate={this.saved}
            pipe={(newPipe) => (this.pipe = newPipe)}/>
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

const mapStateToProps = () => {};

export default connect(mapStateToProps, { addPipe })(PipeAdd);
