import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';
import styled from 'styled-components';

const ScrollJsonView = styled(ReactJsonView)`
  overflow: scroll;
`;

export default function JsonView({ jsonObject, collapsed, style }) {
  return (
    <ScrollJsonView
      name={false}
      src={jsonObject}
      displayDataTypes={false}
      displayObjectSize={false}
      iconStyle="triangle"
      indentWidth="4"
      collapsed={collapsed}
      enableClipboard={false}
      style={style}
    />
  );
}

JsonView.propTypes = {
  jsonObject: PropTypes.object.isRequired,
  style: PropTypes.object,
  collapsed: PropTypes.number
};
