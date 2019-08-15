import React, { useState } from 'react';
import { Drawer, Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import BottomContent from '../common/BottomContent.react';

const { Title, Paragraph } = Typography;

const DrawerContainer = ({ children, ...props }) => {
  const [visible, setVisible] = useState(false);

  const {
    title,
    description,
    width,
    isFullScreen,
    submitText,
    opener,
    onSubmit,
    extra,
    ...restProps
  } = props;

  const openerComponent = opener ? opener(setVisible) : null;

  return (
    <>
      <Drawer
        {...restProps}
        visible={visible}
        width={width || '80vh'}
        placement="right"
        closable={false}
        onClose={() => setVisible(prev => !prev)}
        title={
          title && (
            <>
              <Title level={2}>{title}</Title>
              <Paragraph>{description}</Paragraph>
            </>
          )
        }
      >
        {children}
        {!isFullScreen && (
          <BottomContent extra={extra}>
            <Button
              disabled={!onSubmit}
              type="primary"
              onClick={() => {
                onSubmit();
                setVisible(false);
              }}
            >
              {submitText || 'Submit'}
            </Button>
          </BottomContent>
        )}
      </Drawer>
      {openerComponent}
    </>
  );
};

DrawerContainer.propTypes = {
  submitText: PropTypes.string,
  extra: PropTypes.array,
  onSubmit: PropTypes.func
};

export default DrawerContainer;
