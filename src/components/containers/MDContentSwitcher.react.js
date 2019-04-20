import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Radio } from 'antd';
import MDEditor from './MDEditor.react';
import ReadmeViewerCodeHighlight from '../dumb/ReadmeViewerCodeHighlight.react';
import ReactMarkdown from 'react-markdown';
import { postAlgorithmReadme, postPipelineReadme } from '../../actions/readme.action';

class MDContentSwitcher extends Component {
  state = {
    defaultRadio: 'Edit',
    mdData: ''
  };

  mdData = null;

  componentWillReceiveProps(nextProps) {
    // This will erase any local state updates!
    // Do not do this.
    //this.setState({mdData:data})
    this.setState({ mdData: nextProps.readme });
  }

  onDataChange = data => (this.mdData = data);
  onChange = e => {
    this.setState({ defaultRadio: e.target.value, mdData: this.mdData });
  };
  render() {
    const Comp =
      this.state.defaultRadio === 'Edit' ? (
        <MDEditor data={this.state.mdData} onDataChange={this.onDataChange} />
      ) : (
        <ReactMarkdown
          source={this.state.mdData}
          renderers={{
            code: ReadmeViewerCodeHighlight,
            inlineCode: ReadmeViewerCodeHighlight
          }}
        />
      );
    return (
      <div style={{ marginTop: '20px' }}>
        <Button
          type="primary"
          style={{ left: '90%' }}
          onClick={() => {
            this.setState({ mdData: this.mdData });
            if (this.props.readmeType && this.props.readmeType === 'algorithm') {
              this.props.postAlgorithmReadme(this.props.name, this.mdData);
            } else {
              this.props.postPipelineReadme(this.props.name, this.mdData);
            }
          }}
        >
          Save
        </Button>
        <span>
          <Radio.Group
            style={{ display: 'flex', justifyContent: 'center' }}
            defaultValue={this.state.defaultRadio}
            buttonStyle="solid"
            onChange={this.onChange}
          >
            <Radio.Button value="Edit">Edit</Radio.Button>
            <Radio.Button value="Preview">Preview</Radio.Button>
          </Radio.Group>
        </span>
        <div style={{ marginLeft: '20px' }}>{Comp}</div>
      </div>
    );
  }
}

export default connect(
  null,
  { postAlgorithmReadme, postPipelineReadme }
)(MDContentSwitcher);
