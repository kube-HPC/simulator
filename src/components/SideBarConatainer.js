import React, { Component } from 'react'
import Sidebar from "react-sidebar";
import { connect } from 'react-redux';
import AlgorithmInformation from "./AlgorithmInformation.react";
import {  sideBarClose} from "../actions/sideBar.action";
class SideBarContainer extends Component {
    constructor(){
        super();
        this.sideBar = null;
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.setChildRef = this.setChildRef.bind(this)
        this.state = {
            isOpen : false
        };

      }
    componentDidMount() {
       document.addEventListener('mousedown', this.handleClickOutside);
      }
      handleClickOutside(event) {
        if (this.sidebar&&this.props.sideBar.visible ) {
            if( !this.sidebar.sidebar.contains(event.target)){
          //      alert('You clicked outside of me!');
          //     this.setState({isOpen:true})
                this.props.sideBarClose();
            }
        }
      }
      setChildRef(node) { // receives reference to component as argument
        this.sidebar = node;
      }
    render() {
        return (
            <div 
                onBlur={() => console.log("blue")}>
                <Sidebar
                ref={this.setChildRef}
                    sidebar={<AlgorithmInformation  />}
                    open={this.props.sideBar.visible}
                    // onSetOpen={this.onSetSidebarOpen}
                    styles={{ sidebar: { background: "white",width:"50vw",height:"100vh",position:"fixed",top:"4EM"} }}
                    pullRight={true}
                >
                
                </Sidebar>
            </div>
        )

    }
}

const mapStateToProps = (state) => ({sideBar:state.sideBar});

export default connect(mapStateToProps,{sideBarClose})(SideBarContainer);
