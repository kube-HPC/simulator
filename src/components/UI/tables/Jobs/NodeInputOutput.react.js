import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import humanizeDuration from 'humanize-duration';
import { downloadStorageResults } from 'actions/jobs.action';
import JsonView from '../../../containers/json/JsonView.react';

class NodeInputOutput extends Component {
  constructor() {
    super();
    this.isAlreadySelected = false;
    this.currentTaskId = null;
  }

  onSelect(select) {
    if (
      select.namespace &&
      (select.namespace.includes('input') ||
        select.namespace.includes('output')) &&
      select.name === 'path' &&
      select.value
    ) {
      this.props.downloadStorageResults(select.value);
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
          error: b.error,
          duration: humanizeDuration(b.endTime - b.startTime)
        };
        return (
          <Card key={i}>
            <span style={{ color: '#1890ff' }}>index: {b.batchIndex}</span>
            <JsonView jsonObject={src} />
          </Card>
        );
      });
    } else {
      const src = {
        origInput: payload.origInput,
        input: payload.input,
        output: payload.output && payload.output.storageInfo,
        error: payload.error,
        duration: humanizeDuration(payload.endTime - payload.startTime)
      };
      items = (
        <Card>
          <JsonView jsonObject={src} />
        </Card>
      );
    }

    return <div id="inputOutput">{items}</div>;
  }
}

const mapStateToProps = state => ({});

NodeInputOutput.propTypes = {
  payload: PropTypes.object,
  downloadStorageResults: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { downloadStorageResults }
)(NodeInputOutput);
