import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';
import { Card } from 'components/common';
import { Theme } from 'styles/colors';
/** @typedef {import('react-json-view').ReactJsonViewProps} ReactJsonViewProps */

/** @param {ReactJsonViewProps} props */
const JsonView = props => (
  <ReactJsonView
    theme={Theme.Styles.reactJsonView.theme}
    iconStyle="triangle"
    name={false}
    displayDataTypes={false}
    displayObjectSize={false}
    collapsed="2"
    indentWidth="4"
    enableClipboard={false}
    {...props}
  />
);

/** @param {ReactJsonViewProps & { jsonObject: Object }} props */
const Wrapped = ({ jsonObject, ...props }) => (
  <Card bordered={false}>
    <JsonView {...props} src={jsonObject} />
  </Card>
);

Wrapped.propTypes = {
  // eslint-disable-next-line
  jsonObject: PropTypes.object.isRequired,
};

JsonView.Card = Wrapped;

export default JsonView;
