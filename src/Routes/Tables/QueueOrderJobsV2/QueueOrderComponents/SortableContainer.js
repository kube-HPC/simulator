import React from 'react';
import PropTypes from 'prop-types';

const SortableContainer = ({ onDragSortEnd, onDragSortStart, ...props }) => {
  const handleDragEnd = e => {
    console.log('end event', e);
    console.log('e.sectionRowIndex', e.target.sectionRowIndex);
    onDragSortEnd({ oldIndex: 2, newIndex: 2 });
  };
  const handleDragStart = e => {
    console.log('start event', e);
    console.log('e.sectionRowIndex', e.target.sectionRowIndex);
    onDragSortStart();
  };

  return (
    <tbody {...props} onDragEnd={handleDragEnd} onDragStart={handleDragStart} />
  );
};

SortableContainer.propTypes = {
  onDragSortEnd: PropTypes.func.isRequired,
  onDragSortStart: PropTypes.func.isRequired,
};

export default SortableContainer;
