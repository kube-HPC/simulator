/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useReadMeFile } from 'hooks';
import PropTypes from 'prop-types';
import Drawer from 'components/Drawer';
import { Button, Space, Modal } from 'antd';
import { MdEditor } from 'components/common';

const DrawerReadMeFile = ({ name, type, disabled }) => {
  const [isChange, setIsChange] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfrim, setIsOpenConfrim] = useState(false);
  const { readme, setReadme, onApply } = useReadMeFile(name, type);

  const onChangeReadMe = value => {
    setIsChange(true);
    setReadme(value);
  };
  const closeAll = () => {
    setIsChange(false);
    setIsOpenConfrim(false);
    setIsOpen(false);
  };
  const saveAndClose = () => {
    onApply();

    setTimeout(() => {
      closeAll();
    }, 1000);
  };

  return (
    //
    <>
      <Button
        type="primary"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        title="A readme file can be added after the pipeline had been saved">
        Edit Read Me
      </Button>
      <Drawer
        open={isOpen}
        operation="Read Me File"
        onClose={isChange ? () => setIsOpenConfrim(true) : closeAll}>
        <Space direction="vertical" size="middle">
          <Modal
            title="Save Before Leave"
            open={isOpenConfrim}
            onOk={saveAndClose}
            onCancel={() => closeAll()}
            okText="Yes"
            cancelText="No">
            You are about to exit the "Edit Readme" window Would you like to
            save the changes?
          </Modal>

          <Button onClick={saveAndClose} type="primary">
            Apply Markdown
          </Button>
          <MdEditor value={readme} onChange={onChangeReadMe} />
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
