import React, { useState } from 'react';
import { Drawer, Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import BottomContent from './BottomContent.react';

const { Title, Paragraph } = Typography;

function DrawerContainer({ children, title, description, width, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Drawer
        visible={visible}
        width={width || '80vh'}
        placement="right"
        closable={false}
        onClose={() => setVisible(prev => !prev)}
        title={
          title && (
            <Typography>
              <Title level={2}>{title}</Title>
              <Paragraph>{description}</Paragraph>
            </Typography>
          )
        }
        {...props}
      >
        {children}
        <BottomContent extra={props.extra}>
          <Button
            disabled={!props.onSubmit}
            type="primary"
            onClick={() => {
              props.onSubmit();
              setVisible(false);
            }}
          >
            {props.submitText || 'Submit'}
          </Button>
        </BottomContent>
      </Drawer>
      {props.opener && props.opener(setVisible)}
    </>
  );
}

DrawerContainer.propTypes = {
  submitText: PropTypes.string,
  extra: PropTypes.array,
  onSubmit: PropTypes.func
};

export default DrawerContainer;
