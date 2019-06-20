import React from 'react';
import PropTypes from 'prop-types';
import ReactJsonView from 'react-json-view';
import styled from 'styled-components';
import { Card } from 'antd';

const ScrollJsonView = styled(Card)`
  overflow: auto;
`;

export default function JsonView({ jsonObject, ...props }) {
  return (
    <ScrollJsonView size="small" bordered={false}>
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
    </ScrollJsonView>
  );
}

JsonView.propTypes = {
  jsonObject: PropTypes.object
};
