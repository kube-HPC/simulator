import { Modal, Button, Menu, Dropdown } from 'antd';
import { connect } from 'react-redux';
import { init, updateConnectionServer } from '../actions/serverSelection.action';
import { withState } from 'recompose';

const terminalStyle = {
  display: 'block',
  position: 'relative',
  width: '90vw',
  height: '98vh',
  top: '20px',
  opacity: 0.7

};

class ServerSelection extends React.Component {
  componentWillMount() {
    // this.props.init();
    this.props.updateConnectionServer();
    this.currentSelection = '';
    this.menuItems = '';
    this.serverSelection = '';
  }


  // state = { visible: false };
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

  componentWillReceiveProps(nextProps) {
    // this.serverSelection = nextProps.serverSelection.location;
    // const selectionKeys = Object.keys(nextProps.serverSelection.location);
    // init at first time
    // if (this.currentSelection == '' && selectionKeys.length != 0) {
    //   this.currentSelection = selectionKeys[0];
      
    // }
    // this.currentSelection=this.currentSelection==''?selectionKeys[0]:this.currentSelection;
  }
  // if (this.props.modal.visible != modal.visible) {
  //   if (modal.visible) {
  //   //  this.props.onModalStateChange(!this.props.isClose);
  //  this.props.openTerminalClient();
  //   }
  // }

  componentDidUpdate() {

  }
   render() {
    return null;
   }
  //   const {
  //      serverSelection,
  //     handleVisibleChange,
  //     isVisible,
  //     updateConnectionServer

  //   } = this.props;
  //   const selectionKeys = Object.keys(serverSelection.location);
  //   if (selectionKeys.length != 0) {
  //     this.menuItems = selectionKeys.map((key) =>
  //       <Menu.Item key={key}> {key}</Menu.Item>);
  //   }
  //   const menu =
  //     (<Menu onClick={(e) => {
  //       console.log(e.key);
  //       this.currentSelection = e.key;
  //       updateConnectionServer(this.serverSelection[this.currentSelection]);
  //     }}>
  //       {this.menuItems}
  //     </Menu>);
  //   return 
  // }
}

ServerSelection.propTypes = {
  // columns: React.PropTypes.array.isRequired,
  // data: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  serverSelection: state.serverSelection
});

export default connect(mapStateToProps, { init, updateConnectionServer })(
  withState('isVisible', 'handleVisibleChange', false)(ServerSelection)
);

// WEBPACK FOOTER //
// ./components/TerminalModal.react.js

// WEBPACK FOOTER //
// ./components/TerminalModal.react.js
