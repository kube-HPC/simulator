import React from 'react';
import { TypeTable } from 'const';
import { StarTwoTone } from '@ant-design/icons';
import { Tooltip } from 'antd';

export const TypeRow = obj =>
  obj.type === TypeTable.PREFERRED ? (
    <Tooltip title="Preferred">
      <StarTwoTone style={{ fontSize: '19px' }} />
    </Tooltip>
  ) : (
    ''
  );

export default TypeRow;
