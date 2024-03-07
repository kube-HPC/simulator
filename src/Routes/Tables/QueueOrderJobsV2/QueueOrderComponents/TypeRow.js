import React from 'react';
import { TypeTable } from 'const';
import { StarTwoTone, StarOutlined } from '@ant-design/icons';

export const TypeRow = type =>
  type === TypeTable.PREFERRED ? <StarTwoTone /> : <StarOutlined />;

export default TypeRow;
