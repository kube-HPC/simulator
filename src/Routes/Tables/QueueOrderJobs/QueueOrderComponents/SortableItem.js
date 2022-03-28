import React from 'react';
import { sortableElement } from 'react-sortable-hoc';

const SortableItem = sortableElement(props => <tr {...props} />);

export default SortableItem;
