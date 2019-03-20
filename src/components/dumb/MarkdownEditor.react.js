import React from 'react';
import AceEditor from 'react-ace';
import ace from 'brace';
import PropTypes from 'prop-types';
import { split as SplitEditor} from 'react-ace';

import 'brace/mode/json';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/snippets/json';
import 'brace/ext/language_tools';

import snippet from '../stubs/json-snippet';

// SUPER HACK FOR ADDING SNIPPETS
// eslint-disable-next-line
// ace.define('ace/snippets/json', ['require', 'exports', 'module'], (e, t, n) => {
//   // eslint-disable-next-line
//   (t.snippetText = snippet), (t.scope = 'json');
// });

const MarkdownEditor = ({ data,onDataChange }) => (

  // state = {
  //   source:data,
  // }
 // onChange = (data)=>this.setState(data)
  <div>
    {/* <SplitEditor
      mode="markdown"
      theme="github"
      name="markdown-editor"
      splits={2}
      orientation="beside"
      value={data}
      editorProps={{$blockScrolling: true}}
      fontSize={16}
      minLines={20}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        //showLineNumbers: false,
        tabSize: 2
      }}
  />*/ }
    <AceEditor
      mode="markdown"
      theme="github"
      name="markdown-editor"
      fontSize={16}
      minLines={20}
      // showGutter={false}
      // showPrintMargin={false}
      highlightActiveLine={true}
      value={data}
      //  setOptions={{
      //   enableBasicAutocompletion: true,
      //   enableLiveAutocompletion: true,
      //   enableSnippets: true,
      //   showLineNumbers: true,
      //   tabSize: 2
      // }}
      editorProps={{ $blockScrolling: true }}
      onChange={(data) => onDataChange(data)}
      style={{ width: 'auto' }}/> 
  </div>
);

MarkdownEditor.propTypes = {
  data: PropTypes.string.isRequired,
  onDataChange: PropTypes.string.isRequired,
};

export default MarkdownEditor;
