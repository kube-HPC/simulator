import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReactJsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { Card } from 'components/common';
import { Theme } from 'styles/colors';

const ReactJsonViewStyle = styled(ReactJsonView)`
  .jv-size-chevron {
  }
`;

const JsonView = props => (
  <ReactJsonViewStyle
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
