import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Drawer as AntDrawer } from 'antd';
import styled from 'styled-components';
import { BottomContent } from 'components/common';

export { default as DrawerEditorMD } from './DrawerEditor.react';
export { BottomPanel } from './styles';

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
  bottomContent,
  width,
  isOpened,
  onClose,
  onDidClose,
  title,
  style,
  ...props
}) => {
  const handleVisibleChange = useCallback(
    isVisible => {
      if (!isVisible && onDidClose) onDidClose();
    },
    [onDidClose]
  );

  return (
    <DrawerPadding
      visible={isOpened}
      width={width}
      afterVisibleChange={handleVisibleChange}
      placement="right"
      closable={false}
      onClose={onClose}
      bodyStyle={style}
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
  );
};

Drawer.propTypes = {
  ...AntDrawer.propTypes,
  // TODO: detail the props
  // eslint-disable-next-line
  bottomContent: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDidClose: PropTypes.func,
};

Drawer.defaultProps = {
  bottomContent: undefined,
  width: '50vw',
  onDidClose: undefined,
  title: '',
};

export default Drawer;
