import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { closeModal } from '../actions/modal.action';
import { openTerminalClient, closeTerminalClient, terminalDisconnect } from '../actions/terminal.action';
import { withState } from 'recompose';
import Terminal from '../components/Terminal';
const terminalStyle = {
  display: 'block',
  position: 'relative',
  width: '90vw',
  height: '98vh',
  top: '20px',
  opacity: 0.7

};

class TerminalModal extends React.Component {
  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState({
      visible: false
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  componentWillReceiveProps({ modal }) {
    if (this.props.modal.visible != modal.visible) {
      if (modal.visible) {
      //  this.props.onModalStateChange(!this.props.isClose);
        this.props.openTerminalClient();
      }
    }
  }
  render() {
    const {
      modal,
      closeModal,
      terminalDisconnect,
      openTerminalClient,
      closeTerminalClient,
      onModalStateChange,
      isClose
    } = this.props;

    return (
      <div>
        <Modal
          style={terminalStyle}
          height={'90vh'}
          width={'90vw'}
          visible={modal.visible}
          onCancel={() => {
            closeTerminalClient();
          //  onModalStateChange(!isClose);
            closeModal();
          }}
          footer={null}>
          <Terminal  inlineCommand={modal.command} initTermnialConnection={modal.sshInitData}/>
        </Modal>
      </div>
    );
  }
}

TerminalModal.propTypes = {
  // columns: React.PropTypes.array.isRequired,
  // data: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  modal: state.modal
});

export default connect(mapStateToProps, { closeModal, openTerminalClient, closeTerminalClient, terminalDisconnect })(
  withState('isClose', 'onModalStateChange', true)(TerminalModal)
);

// WEBPACK FOOTER //
// ./components/TerminalModal.react.js

// WEBPACK FOOTER //
// ./components/TerminalModal.react.js
