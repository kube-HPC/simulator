import { Drawer as AntDrawer } from 'antd';
import { BottomContent } from 'components/common';
import PropTypes from 'prop-types';
import React, { useReducer } from 'react';
import styled from 'styled-components';

const noop = () => {};

const DrawerPadding = styled(AntDrawer)`
  .ant-drawer-wrapper-body {
    display: flex;
    flex-direction: column;
    height: inherit;
    justify-content: start;
  }

  .ant-drawer-body {
    position: relative;
    flex-grow: 1;
  }
`;

const Drawer = ({
  children,
  opener = noop,
  bottomContent = undefined,
  width = '50vw',
  ...props
}) => {
  const [visible, toggle] = useReducer(prev => !prev, false);

  return (
    <>
      {opener(toggle)}
      <DrawerPadding
        visible={visible}
        width={width}
        placement="right"
        closable={false}
        onClose={toggle}
        {...props}>
        {children}
        {bottomContent && (
          <>
            <BottomContent.Divider />
            <BottomContent extra={bottomContent.extra}>{bottomContent.body}</BottomContent>
          </>
        )}
      </DrawerPadding>
    </>
  );
};

Drawer.propTypes = {
  ...AntDrawer.propTypes,
  opener: PropTypes.func,
  bottomContent: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Drawer;
