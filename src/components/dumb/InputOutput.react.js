import React, { Component } from 'react';
import { Button, Menu, Dropdown, Icon, Card } from 'antd';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';


class InputOutput extends Component {
  constructor() {
    super();
    this.isAlreadySelected = false;
    this.currentTaskId = null;
  }

  onSelect(select) {
    if (select.namespace && select.namespace[0] === 'output' && select.name === 'path' && select.value) {
      alert(select);
    }
  }

  render() {
    const { props } = this;
    let payload = (props && props.payload) || {};

    let items;

    if (payload.batch && payload.batch.length > 0) {
      items = payload.batch.map((b, i) => {
        const src = {
          origInput: payload.origInput,
          input: b.input,
          output: b.output && b.output.storageInfo,
          error: b.error
        }
        return (
          <Card key={i}>
            <span style={{ color: '#1890ff' }}>index: {b.batchIndex}</span>
            <ReactJson src={src}
              name={false}
              iconStyle="square"
              collapsed={1}
              onSelect={(select) => { this.onSelect(select) }}
              displayDataTypes={false}
              displayObjectSize={false}
              enableClipboard={false} />
          </Card >)
      })
    }
    else {
      const src = {
        origInput: payload.origInput,
        input: payload.input,
        output: payload.output && payload.output.storageInfo,
        error: payload.error
      }
      items = <Card>
        <ReactJson src={src}
          name={false}
          iconStyle="square"
          onSelect={(select) => { this.onSelect(select) }}
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false} />
      </Card >
    }

    return (
      <div id="inputOutput">
        {items}
      </div>
    )
  }
}

InputOutput.propTypes = {
  payload: PropTypes.object
};
export default InputOutput;