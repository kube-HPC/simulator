import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import { connect } from 'react-redux';
import AlgorithmInformation from './AlgorithmInformation.react';
import { sideBarClose } from '../../actions/sideBar.action';
import sideBarTypes from '../../constants/sideBarTypes';
import MDContentSwitcher from './MDContentSwitcher.react';
import AddPipelineContainer from 'components/smart/AddPipelineContainer.react';

class SideBarContainer extends Component {
  constructor() {
    super();
    this.sideBar = null;
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setChildRef = this.setChildRef.bind(this);
    this.state = {
      isOpen: false
    };
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  handleClickOutside(event) {
    if (this.sidebar && this.props.sideBar.visible) {
      if (!this.sidebar.sidebar.contains(event.target)) {
        //      alert('You clicked outside of me!');
        //     this.setState({isOpen:true})
        this.props.sideBarClose();
      }
    }
  }
  setChildRef(node) {
    // receives reference to component as argument
    this.sidebar = node;
  }

  // Passing div in SideBar children because it's props requirement
  render() {
    const { sideBar } = this.props;

    const Component = {
      PIPELINE: <AlgorithmInformation />,
      ALGORITHM: (
        <MDContentSwitcher
          readme={sideBar.data && sideBar.data.data}
          name={sideBar.data && sideBar.data.name}
          readmeType={sideBar.data && sideBar.data.readmeType}
        />
      ),
      ADD_PIPELINE: (
        <AddPipelineContainer
          content={{
            algorithms: sideBar.data ? sideBar.data.payload.algorithms : null,
            pipelines: sideBar.data ? sideBar.data.payload.pipelines : null,
            onSubmit: sideBar.data ? sideBar.data.payload.onSubmit : null
          }}
        />
      )
    };

    const AddPipelineSideBarStyle = { sidebar: { background: 'white', width: '120vh' } };
    return (
      <div>
        <Sidebar
          ref={this.setChildRef}
          sidebar={sideBar.data ? Component[sideBar.data.payload.type] : null}
          open={sideBar.visible}
          styles={
            sideBar.data && sideBar.data.payload.type === sideBarTypes.ADD_PIPELINE
              ? AddPipelineSideBarStyle
              : {
                  sidebar: { background: 'white', width: '50vw', position: 'fixed' }
                }
          }
          pullRight={true}
        >
          <div />
        </Sidebar>
      </div>
    );
  }
}

const mapStateToProps = state => ({ sideBar: state.sideBar });

export default connect(
  mapStateToProps,
  { sideBarClose }
)(SideBarContainer);
