import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import JsonEditor from '../dumb/JsonEditor.react';
import { execStoredPipe } from '../../actions/storedPipes.action';

class ExecuteButton extends Component {
  constructor(props) {
    super(props);
    this.pipe = this.props.pipe;
  }

  componentWillMount() {
    this.state = { visible: false };
  }

  onVisible = () => this.setState({ visible: !this.state.visible })

  showModal = () => {
    this.onVisible();
  };


  handleRun = () => {
    this.props.execStoredPipe(JSON.parse(this.pipe));
    this.onVisible();
  };

  handleCancel = () => {
    this.onVisible();
  };

  handleReset = () => {
    this.pipe = this.props.pipe;
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
            <Button type="primary" size="default" onClick={this.handleRun}>
              {' '}
              Run
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

ExecuteButton.propTypes = {
  execStoredPipe: PropTypes.func.isRequired,
  pipe: PropTypes.string.isRequired
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = { execStoredPipe };

export default connect(mapStateToProps, mapDispatchToProps)(ExecuteButton);
