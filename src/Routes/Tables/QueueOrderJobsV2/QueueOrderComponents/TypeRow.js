import React from 'react';
import { TypeTable } from 'const';
import { StarTwoTone } from '@ant-design/icons';

export const TypeRow = obj =>
  obj.type === TypeTable.PREFERRED ? <StarTwoTone /> : '';

export default TypeRow;
