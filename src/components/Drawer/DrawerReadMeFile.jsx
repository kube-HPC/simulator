/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useReadMeFile } from 'hooks';
import PropTypes from 'prop-types';
import Drawer from 'components/Drawer';
import { Button, Space, Modal, Flex } from 'antd';
import { MdEditorView } from 'components/common';

const DrawerReadMeFile = ({ name = null, type = null, disabled }) => {
  const [isChange, setIsChange] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfrim, setIsOpenConfrim] = useState(false);
  const { readme, setReadme, onApply, getReadMe } = useReadMeFile(name, type);

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

  const openReadMePipeline = () => {
    getReadMe();

    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={openReadMePipeline}
        disabled={disabled}
        title="A readme file can be added after the pipeline had been saved">
        Edit Read Me
      </Button>
      <Drawer
        width="90vw"
        open={isOpen}
        operation="Read Me File"
        onClose={isChange ? () => setIsOpenConfrim(true) : closeAll}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
          <Flex justify="start" gap="10px" style={{ marginBottom: '10px' }}>
            <Button onClick={saveAndClose} type="primary">
              Apply Markdown
            </Button>
            <Button onClick={closeAll} type="primary">
              Cancel
            </Button>
          </Flex>
          <MdEditorView value={readme} onChange={onChangeReadMe} />
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

export default DrawerReadMeFile;
