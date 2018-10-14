import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import JsonEditor from './JsonEditor.react';
import { addPipe } from '../actions/addpipe.action';

class ExecuteButton extends Component {
  constructor(props) {
    super(props);
    this.pipe = this.props.pipe;
  }
  state = { visible: false };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleRun = () => {
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
    this.pipe = this.props.pipe;
    this.setState({ visible: false });
    this.setState({ visible: true });
  };

  render() {
    return (
      <div>
        <Button
          className="Execute"
          type="default"
          size="small"
          onClick={this.showModal}>
          Execute
        </Button>
        <Modal
          title="Execute-Pipeline"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width="800px"
          footer={[
            <Button onClick={this.handleCancel}> Cancel</Button>,
            <Button onClick={this.handleReset}> Reset</Button>,
            <Button type="primary" size="default" onClick={this.handleRun}>
              {' '}
              Run
            </Button>
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

ExecuteButton.propTypes = {
  addPipe: React.PropTypes.func.isRequired,
  pipe: React.PropTypes.string.isRequired
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = { addPipe };

export default connect(mapStateToProps, mapDispatchToProps)(ExecuteButton);
