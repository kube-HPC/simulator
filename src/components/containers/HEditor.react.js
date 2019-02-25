import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Modal, Button, Card, notification, Icon} from 'antd';

import {Paragraph} from '../style/Styled';
import JsonEditor from '../dumb/JsonEditor.react';

class HEditor extends Component {
  constructor(props) {
    super(props);
    this.userData = this.props.jsonTemplate;
    this.isEditable = false;
    this.state = { visible: false };
  }

  onVisible = () => {
    this.userData = this.isEditable ? this.userData : this.props.jsonTemplate;
    this.setState({ visible: !this.state.visible });
}
  showModal = () => {
    this.onVisible()
  };

  handleOk = () => {
    try {
      this.props.action(JSON.parse(this.userData));
      this.isEditable = false;
    } catch (e) {
      notification.config({
        placement: 'bottomRight'
      });
      notification.open({
        message: 'Hkube Editor Error',
        description: e.message,
        icon: <Icon type="warning" style={{color:'red'}}/>
      })
    }

    this.onVisible()
  };

  handleCancel = () => {
    this.onVisible()
  };

  handleReset = () => {
    this.isEditable = false;
    this.userData = this.props.jsonTemplate;
  };

  render() {
    return (
      <div>
        {this.props.styledButton(this.showModal,this.isEditable)}
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
              pipe={(newPipe) => {
                this.isEditable = true;
                this.userData = newPipe;
                }}/>
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
  hintText: PropTypes.object,
};

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(HEditor);
