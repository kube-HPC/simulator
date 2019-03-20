/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { Button,Radio } from "antd";
import { convertToRaw,convertFromRaw,EditorState } from "draft-js";
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons';
import editorStyles from './editorStyles.scss';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import { draftToMarkdown ,markdownToDraft } from 'markdown-draft-js';
const inlineToolbarPlugin = createInlineToolbarPlugin();
const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin,inlineToolbarPlugin, createMarkdownShortcutsPlugin()];

const text = 'asdasd';

export default class MDEditor extends Component {

  state = {
    editorState: EditorState.createWithContent(convertFromRaw(markdownToDraft(this.props.data)))
   // editorState: createEditorStateWithText(text),
    //editorState: createEditorStateWithText(convertFromRaw(markdownToDraft(text)).text)
  };
  componentWillReceiveProps(nextProps) {
    // This will erase any local state updates!
    // Do not do this.
    this.setState({  editorState: EditorState.createWithContent(convertFromRaw(markdownToDraft(nextProps.data))) });
  }
showAlert=()=>{
  if(this.state.editorState&&this.state.editorState.getCurrentContent()){
  //  alert(convertFromRaw(markdownToDraft(text)))
    alert(draftToMarkdown(convertToRaw(this.state.editorState.getCurrentContent())))
  }
}
  onChange = (editorState) => {
  this.props.onDataChange((draftToMarkdown(convertToRaw(this.state.editorState.getCurrentContent()))));
  console.log(convertFromRaw(markdownToDraft(text)))
    this.setState({
      editorState,
    });
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div style={{marginTop:'20px',flex: 1, margin: '0 0', }} >
        {/* <Button type="primary" style={{left:'90%'}} onClick={this.showAlert}>Save</Button> */}
        <div style={{padding:' 16px'}} onClick={this.focus}>
          <Toolbar style={{width:"80vw"}} >
            {
              // may be use React.Fragment instead of div to improve perfomance after React 16
              (externalProps) => (
                <div>
                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <CodeButton {...externalProps} />
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                  <BlockquoteButton {...externalProps} />
                  <CodeBlockButton {...externalProps} />
                </div>
              )
            }
          </Toolbar>
          <div style={{  boxSizing: 'border-box',border: '1px solid #ddd',cursor: 'text',  padding:' 16px',
    borderRadius: '2px',
    marginBottom: '2em',
    boxShadow: 'inset 0px 1px 8px -3px #ABABAB',
    background: '#fefefe',minHeight:'80vh'}} >
            <Editor
              editorState={this.state.editorState}
              onChange={this.onChange}
              plugins={plugins}
              ref={(element) => { this.editor = element; }}
          />
          </div>
        </div>
      </div>
    );
  }
}