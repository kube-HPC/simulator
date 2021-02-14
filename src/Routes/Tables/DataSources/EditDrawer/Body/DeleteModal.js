import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input } from 'antd';
import styled from 'styled-components';
import { COLOR } from 'styles';
import { copyToClipboard } from 'utils';

const DataSourceName = styled.em`
  font-style: normal;
  font-weight: bold;
  background: ${COLOR.lightGrey};
  padding: 0.25em 1ch;
  border-radius: 0.25em;
  border: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
`;

const DeleteModal = ({ onAccept, onClose, isVisible, dataSource }) => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = useCallback(e => setInputValue(e.target.value), [
    setInputValue,
  ]);
  const onClick = useCallback(() => {
    if (inputValue === dataSource.name) onAccept(dataSource.name);
  }, [inputValue, onAccept, dataSource]);
  return (
    <Modal
      width="80ch"
      title="Delete Datasource"
      visible={isVisible}
      onOk={onClick}
      okType="danger"
      okButtonProps={{ disabled: inputValue !== dataSource.name }}
      onCancel={onClose}>
      <p>
        Are you sure you would like to delete datasource
        <span style={{ fontWeight: 'bold' }}>{` ${dataSource.name}?`}</span>
      </p>
      <p>
        Please enter the dataSource name{' '}
        <DataSourceName onClick={() => copyToClipboard(dataSource.name)}>
          {dataSource.name}
        </DataSourceName>{' '}
        in the box below
      </p>
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="dataSource Name"
      />
    </Modal>
  );
};

DeleteModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  dataSource: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
};
export default DeleteModal;
