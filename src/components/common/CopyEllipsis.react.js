import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { notification } from 'antd';
import { Ellipsis } from 'ant-design-pro';

export default function CopyEllipsis({ text, length, children }) {
  return (
    <CopyToClipboard
      text={`${text}`}
      onCopy={() => notification.success({ message: 'Copied to clipboard' })}
    >
      <div>
        <Ellipsis length={length || 20} tooltip>
          {text}
        </Ellipsis>
      </div>
    </CopyToClipboard>
  );
}
