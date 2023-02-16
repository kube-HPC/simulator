import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Tooltip } from 'antd';
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

const Bolded = styled.em`
  font-style: normal;
  font-weight: bolder;
`;

const BoldedBlock = styled(Bolded)`
  display: block;
`;

const WarningText = styled.span`
  display: block;
  color: ${COLOR.red};
`;

const DeleteModal = ({
  onAccept,
  onClose,
  isVisible,
  dataSource,
  isInternalStorage,
  isInternalGit,
}) => {
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
      open={isVisible}
      onOk={onClick}
      okType="danger"
      okButtonProps={{ disabled: inputValue !== dataSource.name }}
      onCancel={onClose}>
      <p>
        Are you sure you would like to delete datasource
        <span style={{ fontWeight: 'bold' }}>{` ${dataSource.name}?`}</span>
        {isInternalGit ? null : (
          <BoldedBlock>
            - the git repository is not internal and will not be deleted
          </BoldedBlock>
        )}
        {isInternalStorage ? null : (
          <BoldedBlock>
            - the storage is not internal and will not be deleted
          </BoldedBlock>
        )}
        <WarningText>
          ** <Bolded>Please note:</Bolded> deleting a datasource is{' '}
          <Bolded>irreversible!</Bolded> **
        </WarningText>
      </p>
      <p>
        Enter the dataSource name{' '}
        <Tooltip title="copy to clipboard">
          <DataSourceName onClick={() => copyToClipboard(dataSource.name)}>
            {dataSource.name}
          </DataSourceName>{' '}
        </Tooltip>
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
  isInternalStorage: PropTypes.bool.isRequired,
  isInternalGit: PropTypes.bool.isRequired,
};
export default DeleteModal;
