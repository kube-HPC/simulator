import React from 'react';
import PropTypes from 'prop-types';

const SortableContainer = ({ onDragSortEnd, ...props }) => {
  const handleDragEnd = () => {
    onDragSortEnd({ oldIndex: 2, newIndex: 2 });
  };

  return <tbody {...props} onDragEnd={handleDragEnd} />;
};

SortableContainer.propTypes = {
  onDragSortEnd: PropTypes.func.isRequired,
};

export default SortableContainer;
