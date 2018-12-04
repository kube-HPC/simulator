import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';

import { addPipe } from '../actions/addPipe.action';

import JsonEditor from './JsonEditor.react';
import template from './lib/json-object.json';
import './AddPipe.css';

const jsonTemplate = JSON.stringify(template, null, 2);

class AddPipe extends Component {
  constructor() {
    super();
    this.pipe = jsonTemplate;
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
      visible = true;
    }
    this.setState({ visible });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleReset = () => {
    this.pipe = jsonTemplate;
    this.setState({ visible: false });
    this.setState({ visible: true });
  };

  render() {
    return (
      <div>
        <Button
          className="buttonPipeline"
          type="default"
          size="default"
          onClick={this.showModal} >
          + Pipeline
        </Button>
        <Modal
          title="Add-Pipeline"
          visible={this.state.visible}
          onOk={this.handleAddPipe}
          onCancel={this.handleCancel}
          width="800px"
          footer={[
            <Button type="primary" size="default" onClick={this.handleAddPipe}>
              {' '}
              Store Pipeline
            </Button>,
            <Button onClick={this.handleReset}> Reset</Button>,
            <Button onClick={this.handleCancel}> Cancel</Button>
          ]}>
          <JsonEditor
            jsonTemplate={this.pipe}
            pipe={(newPipe) => (this.pipe = newPipe)}/>
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
