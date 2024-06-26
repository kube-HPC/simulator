import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer as AntDrawer } from 'antd';
import styled from 'styled-components';
import { BottomContent } from 'components/common';

export {
  BottomPanel,
  RightAlignedButton,
  PanelButton,
  RightAlignedBox,
  RightPanel,
  PanelButtonWizard,
} from './styles';

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
    transition: opacity 100ms ease-in-out;
    flex-direction: column;
    display: ${attrs => (attrs['data-as-flex'] ? 'flex' : '')};
  }
`;

/**
 * @param {{
 *   style: import('react').CSSProperties;
 *   wrapperStyle: import('react').CSSProperties;
 *   width: string;
 *   isOpened: boolean;
 *   onClose: function;
 *   onDidClose: function;
 *   title: string;
 * }} props
 */

const Drawer = ({
  children,
  bottomContent = undefined,
  width = '50vm',
  isOpened = false,
  onClose,
  onDidClose = undefined,
  onDidOpen,
  title = '',
  wrapperStyle,
  style,
  asFlex = false,
  ...props
}) => {
  const [hasEntered, setEntered] = useState(false);

  const handleVisibleChange = useCallback(
    isVisible => {
      if (!isVisible && onDidClose) onDidClose();
      if (isVisible) {
        setEntered(true);
        onDidOpen && onDidOpen();
      }
    },
    [onDidClose, onDidOpen, setEntered]
  );

  return (
    <DrawerPadding
      open={isOpened}
      width={width}
      afterOpenChange={handleVisibleChange}
      placement="right"
      closable={false}
      onClose={onClose}
      data-as-flex={asFlex}
      styles={{
        body: {
          ...style,
          opacity: hasEntered ? 1 : 0,
        },
      }}
      title={title}
      // eslint-disable-next-line
      {...props}>
      {hasEntered ? (
        <>
          {children}
          {bottomContent && (
            <>
              <BottomContent.Divider />
              <BottomContent extra={bottomContent.extra}>
                {bottomContent.body}
              </BottomContent>
            </>
          )}
        </>
      ) : null}
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
  isOpened: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDidClose: PropTypes.func,
  asFlex: PropTypes.bool,
};

export default Drawer;
