import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';
import styled from 'styled-components';

const ScrollJsonView = styled(ReactJsonView)`
  overflow: scroll;
`;

export default function JsonView({ jsonObject, ...props }) {
  return (
    <ScrollJsonView
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
  );
}

JsonView.propTypes = {
  jsonObject: PropTypes.object
};
