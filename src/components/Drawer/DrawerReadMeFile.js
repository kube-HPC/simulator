import React, { useReducer } from 'react';
import { useReadMeFile } from 'hooks';
import PropTypes from 'prop-types';
import Drawer from 'components/Drawer';
import { Button, Space } from 'antd';
import { MdEditor } from 'components/common';

const DrawerReadMeFile = ({ name, type, disabled }) => {
  const [isOpen, toggle] = useReducer(prev => !prev, false);
  const { readme, setReadme, onApply } = useReadMeFile(name, type);
  return (
    //
    <>
      <Button
        type="primary"
        onClick={toggle}
        disabled={disabled}
        title="A readme file can be added after the pipeline had been saved">
        Edit Read Me
      </Button>
      <Drawer open={isOpen} operation="Read Me File" onClose={toggle}>
        <Space direction="vertical" size="middle">
          <Button onClick={onApply}>Apply Markdown</Button>
          {readme && <MdEditor value={readme} onChange={setReadme} />}
        </Space>
      </Drawer>
    </>
  );
};

DrawerReadMeFile.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
};
DrawerReadMeFile.defaultProps = {
  type: null,
  name: null,
};
export default DrawerReadMeFile;
