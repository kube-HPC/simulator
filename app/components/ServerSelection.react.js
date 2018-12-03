import { Modal, Button, Menu, Dropdown } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { init, updateConnectionServer } from '../actions/serverSelection.action';
import { withState } from 'recompose';

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
  }

  componentDidUpdate() {

  }
  render() {
    return null;
  }
}

ServerSelection.propTypes = {
  // columns: PropTypes.array.isRequired,
  // data: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  serverSelection: state.serverSelection
});

export default connect(mapStateToProps, { init, updateConnectionServer })(
  withState('isVisible', 'handleVisibleChange', false)(ServerSelection)
);
