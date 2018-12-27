import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Modal, Button, Card} from 'antd';

import {ButtonAddPipeline,Paragraph} from './Styled';
import {addPipe} from '../actions/addPipe.action';
import JsonEditor from './JsonEditor.react';
import template from './lib/json-object.json';

const jsonTemplate = JSON.stringify(template, null, 2);

class AddPipe extends Component {
  constructor() {
    super();
    this.pipe = jsonTemplate;
    this.state = {visible: false};
  }

  showModal = () => {
    this.setState({visible: true});
  };

  handleAddPipe = () => {
    let visible = false;
    try {
      this.props.addPipe(JSON.parse(this.pipe));
    } catch (e) {
      visible = true;
    }
    this.setState({visible});
  };

  handleCancel = () => {
    this.setState({visible: false});
  };

  handleReset = () => {
    this.pipe = jsonTemplate;
    this.setState( (state)=> {
      state.visible = !state.visible;
      state.visible = !state.visible;
    });
  };

  render() {
    return (
      <div>
        <ButtonAddPipeline onClick={this.showModal}> + Pipeline </ButtonAddPipeline>
        <Modal
          title="Add Pipeline Editor"
          visible={this.state.visible}
          onOk={this.handleAddPipe}
          onCancel={this.handleCancel}
          footer={[
            <Button key={1} type="primary" size="default" onClick={this.handleAddPipe}> Store Pipeline </Button>,
            <Button key={2} onClick={this.handleReset}> Reset</Button>,
            <Button key={3} onClick={this.handleCancel}> Cancel</Button>,
          ]}>
          <Card>
            <JsonEditor
              jsonTemplate={this.pipe}
              pipe={(newPipe) => (this.pipe = newPipe)}/>
          </Card>
          <Paragraph>
            Hint: Type <strong>node</strong> for adding pipe-node.
          </Paragraph>
        </Modal>
      </div>
    );
  }
}

AddPipe.propTypes = {
  addPipe: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = {addPipe};

export default connect(mapStateToProps, mapDispatchToProps)(AddPipe);
