import React, { useCallback } from 'react';
import { Button, Modal } from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useActions } from 'hooks';
import { selectors } from 'reducers';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  gap: 6px;
  margin-left: 8px;
`;

const PreferencesButtons = () => {
  const { savePreferences, resetPreferences } = useActions();
  const { data, syncing } = useSelector(selectors.preferences);

  const handleSave = useCallback(() => {
    savePreferences(data);
  }, [savePreferences, data]);

  const handleReset = useCallback(() => {
    Modal.confirm({
      title: 'Reset Preferences?',
      content:
        'This will restore all preferences (theme, scoop interval, table columns) to their default values.',
      okText: 'Reset',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        resetPreferences();
      },
    });
  }, [resetPreferences]);

  return (
    <Wrapper>
      <Button
        icon={<SaveOutlined />}
        onClick={handleSave}
        loading={syncing}
        size="small">
        Save Table Layout
      </Button>
      <Button
        icon={<UndoOutlined />}
        onClick={handleReset}
        loading={syncing}
        size="small"
        danger>
        Reset Preferences
      </Button>
    </Wrapper>
  );
};

export default PreferencesButtons;
