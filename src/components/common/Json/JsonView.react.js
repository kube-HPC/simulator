import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';
import { Card } from '..';

const JsonView = ({ jsonObject, ...props }) => (
  <Card bordered={false}>
    <ReactJsonView
      iconStyle="triangle"
      name={false}
      displayDataTypes={false}
      displayObjectSize={false}
      collapsed="2"
      indentWidth="4"
      enableClipboard={false}
      {...props}
      src={jsonObject}
    />
  </Card>
);

JsonView.propTypes = {
  jsonObject: PropTypes.object
};

export default React.memo(JsonView);
