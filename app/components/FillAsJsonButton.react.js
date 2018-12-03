import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import JsonEditor from './JsonEditor.react';
import PropTypes from 'prop-types';
class FillAsJsonButton extends Component {
  constructor(props) {
    super(props);
    this.algorithm = this.props.algorithm;
  }

  componentWillMount() {
    this.state = { visible: false };
  }

  onVisible = () => this.setState({ visible: !this.state.visible })

  showModal = () => {
    this.onVisible();
  };

  handleUpdate = () => {
    this.props.action(JSON.parse(this.algorithm));
    this.onVisible();
  };

  handleCancel = () => {
    this.onVisible();
  };

  handleReset = () => {
    this.algorithm = this.props.algorithm;
  };

  render() {
    return (
      <div>
        <Button
          className="AlgorithmJson"
          type="dashed"
          onClick={this.showModal}>
          Add as JSON
        </Button>
        <Modal
          title="Add new Algorithm to Store"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width="800px"
          footer={[
            <Button onClick={this.handleCancel}> Cancel</Button>,
            <Button onClick={this.handleReset}> Reset</Button>,
            <Button type="primary" size="default" onClick={this.handleUpdate}>
              Add Algorithm
            </Button>
          ]}>
          <JsonEditor
            jsonTemplate={this.algorithm}
            pipe={(newAlgorithm) => (this.algorithm = newAlgorithm)}/>
          <p>
            Use <code>Ctrl+Space</code> for{' '} <strong>auto-completion</strong>.
          </p>
        </Modal>
      </div>
    );
  }
}

FillAsJsonButton.propTypes = {
  action: PropTypes.func.isRequired,
  algorithm: PropTypes.string.isRequired
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(FillAsJsonButton);
