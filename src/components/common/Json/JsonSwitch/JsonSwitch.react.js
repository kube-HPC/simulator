import React from 'react';
import PropTypes from 'prop-types';
import { JsonTable, JsonView, Tabs } from 'components/common';
import { Button } from 'antd';
import { notification } from 'utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';

const TABS = {
  JSON: 'JSON',
  TABLE: 'Table',
};

const Wrapper = styled.div`
  max-width: 80vw;
`;

const onCopy = () =>
  notification({ message: 'JSON Copied to Clipboard', type: notification.TYPES.SUCCESS });

const JsonSwitch = ({ obj }) => {
  const extra = (
    <CopyToClipboard text={obj} onCopy={onCopy}>
      <Button type="dashed">Copy</Button>
    </CopyToClipboard>
  );
  return (
    <Tabs tabPosition="left" tabBarExtraContent={extra} type="card">
      <Tabs.TabPane key={TABS.TABLE} tab={TABS.TABLE}>
        <Wrapper>
          <JsonTable obj={obj} />
        </Wrapper>
      </Tabs.TabPane>
      <Tabs.TabPane key={TABS.JSON} tab={TABS.JSON}>
        <JsonView jsonObject={obj} />
      </Tabs.TabPane>
    </Tabs>
  );
};

JsonSwitch.propTypes = {
  obj: PropTypes.object.isRequired,
};

export default JsonSwitch;
