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

export default function JsonEditor({
  onChange,
  value,
  showGutter = true,
  snippetEnabled = true,
  style
}) {
  if (snippetEnabled) {
    // A HACK FOR ADDING SNIPPETS
    ace.define('ace/snippets/json', ['require', 'exports', 'module'], (e, t, n) => {
      // eslint-disable-next-line
      (t.snippetText = snippet), (t.scope = 'json');
    });
  }

  return (
    <AceEditor
      mode="json"
      theme="github"
      name="json-editor"
      fontSize={16}
      showGutter={showGutter}
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
      style={{ width: 'unset', height: '50vh', ...style }}
    />
  );
}

JsonEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  snippetEnabled: PropTypes.bool,
  showGutter: PropTypes.bool,
  style: PropTypes.object.isRequired
};
