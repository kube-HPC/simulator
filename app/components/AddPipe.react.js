import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Modal, Button } from 'antd';

import { addPipe } from '../actions/addpipe.action';

import JsonEditor from './JsonEditor.react';
import template from './lib/json-object.json';

const jsonTemplate = JSON.stringify(template, null, 2);

class AddPipe extends Component {
  constructor() {
    super();
    this.pipe = jsonTemplate;
    this.saved = this.pipe;
  }
  state = { visible: false };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleAddPipe = () => {
    let visible = false;
    try {
      this.props.addPipe(JSON.parse(this.pipe));
    } catch (e) {
      // TODO: how to handle error?;
      window.alert('Invalid Json File, Pipe NOT ADDED');
      console.log(e.message);
      visible = true;
    }
    this.saved = this.pipe;
    this.setState({ visible });
  };

  handleCancel = () => {
    this.saved = this.pipe;
    this.setState({ visible: false });
  };

  handleReset = () => {
    this.pipe = jsonTemplate;
    this.saved = this.pipe;
    this.setState({ visible: false });
    this.setState({ visible: true });
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
            Use <code>node</code> <strong>snippet</strong> for adding{' '}
            <strong>pipe-node</strong>. Use <code>Ctrl+Space</code> for{' '}
            <strong>auto-completion</strong>.
          </p>
        </Modal>
      </div>
    );
  }
}

AddPipe.propTypes = {
  addPipe: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = { addPipe };

export default connect(mapStateToProps, mapDispatchToProps)(AddPipe);
