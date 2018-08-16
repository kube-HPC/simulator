import React from 'react';
import AceEditor from 'react-ace';
import ace from 'brace';

import 'brace/mode/json';
import 'brace/theme/dreamweaver';
import 'brace/snippets/json';
import 'brace/ext/language_tools';

import jsonTemplate from './lib/json-object.json';

// SUPER HACK TO ADD SNIPPET
// TODO: parse string from file

// eslint-disable-next-line
ace.define('ace/snippets/json', ['require', 'exports', 'module'], (e, t, n) => {
  // eslint-disable-next-line
  (t.snippetText =
    // eslint-disable-next-line
    '\
# AddNode\n\
snippet nodeadd\n\
	{\n\
			"name": "${1:name}",\n\
			"nodes": [\n\
				{\n\
					"nodeName": "${2:node_name}",\n\
					"algorithmName": "${3:algo_name}",\n\
					"input": [\n\
						"${4:input_target}"\n\
					]\n\
				}\n\
			],\n\
			"flowInput": {\n\
				"files": {\n\
					"link": "${5:link_name}"\n\
				}\n\
			},\n\
			"webhooks": {\n\
				"progress": "${6:progess}",\n\
				"result": "${7:result}",\n\
			},\n\
			"priority": "${8:priority_number}",\n\
			"options": {\n\
				"progressVerbosityLevel": "${9:level}"\n\
			}\n\
  }\n\
  '), // eslint-disable-line
    (t.scope = 'json');
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
