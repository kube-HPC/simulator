import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';
import { Card } from 'components/common';

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
  // eslint-disable-next-line
  jsonObject: PropTypes.object.isRequired,
};

export default React.memo(JsonView);
