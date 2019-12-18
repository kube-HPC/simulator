import React from 'react';
import PropTypes from 'prop-types';
import { JsonTable, JsonView, Tabs } from 'components/common';
import { Button } from 'antd';
import { notification, stringify } from 'utils';
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

const EMPTY = {};

const JsonSwitch = ({ obj, options: { view = EMPTY, table = EMPTY } }) => {
  const extra = (
    <CopyToClipboard text={stringify(obj)} onCopy={onCopy}>
      <Button type="dashed">Copy</Button>
    </CopyToClipboard>
  );
  return (
    <Tabs tabPosition="left" tabBarExtraContent={extra} type="card">
      <Tabs.TabPane key={TABS.TABLE} tab={TABS.TABLE}>
        <Wrapper>
          <JsonTable obj={obj} {...table} />
        </Wrapper>
      </Tabs.TabPane>
      <Tabs.TabPane key={TABS.JSON} tab={TABS.JSON}>
        <JsonView jsonObject={obj} {...view} />
      </Tabs.TabPane>
    </Tabs>
  );
};

JsonSwitch.propTypes = {
  obj: PropTypes.object.isRequired,
  options: PropTypes.object,
};

export default JsonSwitch;
