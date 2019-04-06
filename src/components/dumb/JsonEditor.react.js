import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import ace from 'brace';

import snippet from 'config/jsonEditor.snippet';

// Set Ace-Editor properties
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/snippets/json';
import 'brace/ext/language_tools';

// SUPER HACK FOR ADDING SNIPPETS
ace.define('ace/snippets/json', ['require', 'exports', 'module'], (e, t, n) => {
  (t.snippetText = snippet), (t.scope = 'json');
});

export default function JsonEditor({ onChange, value }) {
  return (
    <div>
      <AceEditor
        mode="json"
        theme="github"
        name="json-editor"
        fontSize={14}
        showGutter={true}
        showPrintMargin={false}
        highlightActiveLine={true}
        value={value}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: false,
          tabSize: 2
        }}
        editorProps={{ $blockScrolling: true }}
        onChange={onChange}
        style={{ width: 'auto', height: '-webkit-fill-available', fontFamily: 'monospace' }}
      />
    </div>
  );
}

JsonEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};
