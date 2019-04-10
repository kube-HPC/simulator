import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';

export default function JsonView({ jsonObject, collapsed }) {
  return (
    <ReactJsonView
      name={false}
      src={jsonObject}
      displayDataTypes={false}
      displayObjectSize={false}
      iconStyle="triangle"
      indentWidth="4"
      collapsed={collapsed}
      enableClipboard={false}
    />
  );
}

JsonView.propTypes = {
  jsonObject: PropTypes.object.isRequired,
  collapsed: PropTypes.number
};
