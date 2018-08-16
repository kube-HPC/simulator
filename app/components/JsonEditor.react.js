import React from 'react';
import AceEditor from 'react-ace';
import ace from 'brace';

import 'brace/mode/json';
import 'brace/theme/dreamweaver';
import 'brace/snippets/json';
import 'brace/ext/language_tools';

import jsonTemplate from './lib/json-object.json';
import snippet from './lib/json-snippet';

// SUPER HACK FOR ADDING SNIPPETS
ace.define('ace/snippets/json', ['require', 'exports', 'module'], (e, t, n) => {
  // eslint-disable-next-line
  (t.snippetText = snippet), (t.scope = 'json');
});

const JsonEditor = () => (
  <div>
    <AceEditor
      mode="json"
      theme="dreamweaver"
      name="json-editor"
      fontSize={14}
      width="760px"
      showPrintMargin
      showGutter
      highlightActiveLine
      value={JSON.stringify(jsonTemplate, null, 2)}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2
      }}
      editorProps={{ $blockScrolling: true }}/>
  </div>
);

export default JsonEditor;
