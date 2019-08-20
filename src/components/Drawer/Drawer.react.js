import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Drawer as AntDrawer } from 'antd';

const Drawer = ({ children, width, opener, ...props }) => {
  const [visible, setVisible] = useState(false);

  const onClose = () => setVisible(prev => !prev);

  return (
    <>
      {opener(setVisible)}
      <AntDrawer
        visible={visible}
        placement="right"
        closable={false}
        width={width || '50vw'}
        onClose={onClose}
        {...props}
      >
        {children}
      </AntDrawer>
    </>
  );
};

Drawer.defaultProps = {
  opener: () => null
};

Drawer.propTypes = {
  opener: PropTypes.func,
  ...AntDrawer.propTypes
};

export default Drawer;
