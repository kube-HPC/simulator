import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Drawer as AntDrawer } from 'antd';
import { BottomContent } from 'components/common';

const Drawer = ({ children, opener, bottomContent, ...props }) => {
  const [visible, setVisible] = useState(false);
  const onClose = () => setVisible(prev => !prev);

  return (
    <>
      {opener(setVisible)}
      <AntDrawer visible={visible} placement="right" closable={false} onClose={onClose} {...props}>
        {children}
        {bottomContent && (
          <>
            <BottomContent.Divider />
            <BottomContent extra={bottomContent.extra}>{bottomContent.body}</BottomContent>
          </>
        )}
      </AntDrawer>
    </>
  );
};

Drawer.defaultProps = {
  opener: () => null,
  bottomContent: undefined,
  width: '50vw'
};

Drawer.propTypes = {
  opener: PropTypes.func,
  ...AntDrawer.propTypes
};

export default Drawer;
