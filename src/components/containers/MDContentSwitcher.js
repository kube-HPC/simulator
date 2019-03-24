import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button,Radio } from "antd";
import MDEditor from "./MDEditor.react";
import MarkdownEditor from "../dumb/MarkdownEditor.react";
import ReadmeViewerCodeHighlight from '../dumb/ReadmeViewerCodeHighlight';
import ReactMarkdown from 'react-markdown';
import { postAlgorithmReadme,postPipelineReadme } from "../../actions/readme.action";



class MDContentSwitcher extends Component{
    state = {
        defaultRadio:'Edit',
        mdData: ''
    } 

    mdData = null;
    // static getDerivedStateFromProps(props, state) {
    //   return{
    //     mdData: props.readme
    // } 
    // }

    componentWillReceiveProps(nextProps) {
      // This will erase any local state updates!
      // Do not do this.
      //this.setState({mdData:data})
      this.setState({ mdData: nextProps.readme });
    }
    
    onDataChange  =(data)=> this.mdData =data;
    onChange= (e) =>{ this.setState({defaultRadio:e.target.value,mdData:this.mdData})}
    render(){
        const Comp = this.state.defaultRadio==='Edit'?
          <MDEditor data={this.state.mdData} onDataChange={this.onDataChange}/>:
          <ReactMarkdown  source={this.state.mdData}  renderers={{
          code: ReadmeViewerCodeHighlight,
          inlineCode: ReadmeViewerCodeHighlight
        }}/>;
       const SideBySIde =<div style={{display:"flex"}} ><MarkdownEditor data={this.state.mdData} onDataChange={this.onDataChange}/><ReactMarkdown source={this.state.mdData}/></div>
        return(
        //   <div style={{marginTop:'20px'}} >
        //     <Button type="primary" style={{left:'90%'}}>Save</Button>  
        //     <div style={{display:"flex"}} >
        //       <div style={{border:'solid 1px #fffeef',}} >
        //         <MarkdownEditor data={this.state.mdData} onDataChange={this.onDataChange}/>

        //       </div>
        //       <ReactMarkdown source={this.state.mdData}/>
        //     </div>
          <div style={{marginTop:'20px'}} >
            <Button type="primary" style={{left:'90%'}} onClick={()=>{
              this.setState({mdData:this.mdData});
              if(this.props.readmeType&&this.props.readmeType=='algorithm'){
                this.props.postAlgorithmReadme(this.props.name,this.mdData)
              } 
              else{
                this.props.postPipelineReadme(this.props.name,this.mdData)

              }
               }} >Save</Button>  
            <span   >
              <Radio.Group style={{display: 'flex',justifyContent: 'center'}} defaultValue={this.state.defaultRadio} buttonStyle="solid" onChange={this.onChange} >
                <Radio.Button value="Edit">Edit</Radio.Button>
                <Radio.Button value="Preview"  >Preview</Radio.Button> 
              </Radio.Group> 
            </span> 
            <div style={{marginLeft:'20px'}} >
              {Comp}

            </div>
          </div>
          
        )
    }

    }

export default connect(null, { postAlgorithmReadme,postPipelineReadme })(MDContentSwitcher);
