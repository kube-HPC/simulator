import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Modal, Button, Card} from 'antd';

import {Paragraph} from './Styled';
import {addPipe} from '../actions/addPipe.action';
import JsonEditor from './JsonEditor.react';

class HEditor extends Component {
  constructor(props) {
    super(props);
    this.userData = this.props.jsonTemplate;
    this.state = {visible: false};
  }

  onVisible = () => this.setState({ visible: !this.state.visible })

  showModal = () => {
    this.onVisible()
  };

  handleOk = () => {
    this.props.action(JSON.parse(this.userData));
    this.onVisible()
  };

  handleCancel = () => {
    this.onVisible()
  };

  handleReset = () => {
    this.userData = this.props.jsonTemplate;
  };

  render() {
    return (
      <div>
        {this.props.styledButton(this.showModal)}
        <Modal
          title={this.props.title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key={1} type="primary" size="default" onClick={this.handleOk}>{this.props.okText}</Button>,
            <Button key={2} onClick={this.handleReset}> Reset</Button>,
            <Button key={3} onClick={this.handleCancel}> Cancel</Button>,
          ]}>
          <Card>
            <JsonEditor
              jsonTemplate={this.userData}
              pipe={(newPipe) => (this.userData = newPipe)}/>
          </Card>
          <Paragraph>
            {this.props.hintText}
          </Paragraph>
        </Modal>
      </div>
    );
  }
}

HEditor.propTypes = {
  action: PropTypes.func.isRequired,
  jsonTemplate: PropTypes.string.isRequired,
  okText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  styledButton: PropTypes.func.isRequired,
  hintText: PropTypes.symbol.isRequired,
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = {addPipe};

export default connect(mapStateToProps, mapDispatchToProps)(HEditor);
