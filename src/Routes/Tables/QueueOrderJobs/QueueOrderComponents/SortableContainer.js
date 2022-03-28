import React from 'react';
import { sortableContainer } from 'react-sortable-hoc';

const SortableContainer = sortableContainer(props => <tbody {...props} />);

export default SortableContainer;
