import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
// import { sortableHandle } from 'react-sortable-hoc';

const DragHandle = ({ testId }) => (
  <MenuOutlined data-testid={testId} style={{ color: '#999' }} />
);

DragHandle.propTypes = {
  testId: PropTypes.string.isRequired,
};

export default DragHandle;
