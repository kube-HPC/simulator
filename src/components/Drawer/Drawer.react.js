import { Drawer as AntDrawer } from 'antd';
import { BottomContent } from 'components/common';
import PropTypes from 'prop-types';
import React, { useCallback, useReducer } from 'react';
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
  opener,
  bottomContent,
  width,
  startOpen,
  onClose,
  title,
  ...props
}) => {
  const [visible, toggle] = useReducer(prev => !prev, startOpen);
  const handleVisibleChange = useCallback(
    isVisible => {
      if (isVisible) return;
      if (onClose) onClose();
    },
    [onClose]
  );

  return (
    <>
      {opener(toggle)}
      <DrawerPadding
        visible={visible}
        width={width}
        afterVisibleChange={handleVisibleChange}
        placement="right"
        closable={false}
        onClose={toggle}
        title={title}
        // eslint-disable-next-line
        {...props}>
        {children}
        {bottomContent && (
          <>
            <BottomContent.Divider />
            <BottomContent extra={bottomContent.extra}>
              {bottomContent.body}
            </BottomContent>
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
  startOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
};

Drawer.defaultProps = {
  opener: noop,
  bottomContent: undefined,
  width: '50vw',
  startOpen: false,
  onClose: undefined,
  title: '',
};

export default Drawer;
