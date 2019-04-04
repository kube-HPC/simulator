import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { sideBarOpen, sideBarClose } from '../../actions/sideBar.action';

function AddPipeline(props) {
  return <div>{JSON.stringify(props.storedPipelines)}</div>;
}

AddPipeline.propTypes = {
  storedPipelines: PropTypes.array
};

const mapStateToProps = state => ({
  storedPipelines: state.storedPipeline.dataSource,
  sideBar: state.sideBar
});

export default connect(
  mapStateToProps,
  { sideBarOpen, sideBarClose }
)(AddPipeline);
