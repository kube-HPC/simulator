import React from 'react';
import AceEditor from 'react-ace';
import ace from 'brace';
import PropTypes from 'prop-types';

import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/snippets/json';
import 'brace/ext/language_tools';

import snippet from '../stubs/json-snippet';

// SUPER HACK FOR ADDING SNIPPETS
// eslint-disable-next-line
ace.define('ace/snippets/json', ['require', 'exports', 'module'], (e, t, n) => {
  // eslint-disable-next-line
  (t.snippetText = snippet), (t.scope = 'json');
});

const JsonEditor = ({ pipe, jsonTemplate }) => (
  <div>
    <AceEditor
      mode="json"
      theme="github"
      name="json-editor"
      fontSize={14}
      showGutter={false}
      showPrintMargin={false}
      highlightActiveLine={true}
      value={jsonTemplate}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: false,
        tabSize: 2
      }}
      editorProps={{ $blockScrolling: true }}
      onChange={changedText => pipe(changedText)}
      style={{ width: 'auto', height: '60vh', fontFamily: 'monospace' }}
    />
  </div>
);

JsonEditor.propTypes = {
  pipe: PropTypes.func.isRequired,
  jsonTemplate: PropTypes.string.isRequired
};

export default JsonEditor;
