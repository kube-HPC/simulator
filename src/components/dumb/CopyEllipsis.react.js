import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { notification, Icon } from 'antd';
import { Ellipsis } from 'ant-design-pro';

import styled from 'styled-components';

const IconWhite = styled(Icon)`
  color: rgba(187, 180, 180, 0.75);
  margin-right: 10px;
`;

export default function CopyEllipsis({ text }) {
  return (
    <CopyToClipboard
      text={`${text}`}
      onCopy={() => notification.success({ message: 'Copied to clipboard' })}
    >
      <div>
        <IconWhite type="right" />
        <Ellipsis length={20} tooltip>
          {text}
        </Ellipsis>
      </div>
    </CopyToClipboard>
  );
}
