import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Radio } from 'antd';
import MDEditor from './MDEditor.react';
import ReactMarkdown from 'react-markdown';
import { postAlgorithmReadme, postPipelineReadme } from 'actions/readme.action';

function MDContentSwitcher(props) {
  const [value, setValue] = useState({
    defaultRadio: 'Edit',
    mdData: null
  });

  useEffect(() => {
    setValue(prev => ({ ...prev, mdData: props.readme }));
  }, [props.readme, setValue]);

  const onDataChange = data => (value.mdData = data);

  const onChange = e => setValue({ defaultRadio: e.target.value, mdData: value.mdData });

  const Comp =
    value.defaultRadio === 'Edit' ? (
      <MDEditor data={value.mdData} onDataChange={onDataChange} />
    ) : (
      <ReactMarkdown source={value.mdData} />
    );

  const dispatch = useDispatch();

  return (
    <div style={{ marginTop: '20px' }}>
      <Button
        disabled
        type="primary"
        style={{ left: '90%' }}
        onClick={() => {
          setValue({ mdData: value.mdData });
          if (props.readmeType && props.readmeType === 'algorithm') {
            dispatch(postAlgorithmReadme(props.name, value.mdData));
          } else {
            dispatch(postPipelineReadme(props.name, value.mdData));
          }
        }}
      >
        Save
      </Button>
      <span>
        <Radio.Group
          style={{ display: 'flex', justifyContent: 'center' }}
          defaultValue={value.defaultRadio}
          buttonStyle="solid"
          onChange={onChange}
        >
          <Radio.Button value="Edit">Edit</Radio.Button>
          <Radio.Button value="Preview">Preview</Radio.Button>
        </Radio.Group>
      </span>
      <div style={{ marginLeft: '20px' }}>{Comp}</div>
    </div>
  );
}

export default MDContentSwitcher;
