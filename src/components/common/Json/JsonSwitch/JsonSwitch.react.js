import { Button } from 'antd';
import { JsonTable, JsonView, Tabs } from 'components/common';
import PropTypes from 'prop-types';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { notification, stringify } from 'utils';

const TABS = {
  JSON: 'JSON',
  TABLE: 'Table',
};

const Wrapper = styled.div`
  max-width: 80vw;
`;

const onCopy = () =>
  notification({
    message: 'JSON Copied to Clipboard',
    type: notification.TYPES.SUCCESS,
  });

const JsonSwitch = ({ obj, options, jobId }) => {
  const { view = {}, table = {} } = options;
  const extra = (
    <CopyToClipboard text={stringify(obj)} onCopy={onCopy}>
      <Button type="dashed">Copy</Button>
    </CopyToClipboard>
  );
  return (
    <Tabs tabPosition="left" tabBarExtraContent={extra} type="card">
      <Tabs.TabPane key={TABS.TABLE} tab={TABS.TABLE}>
        <Wrapper>
          <JsonTable
            obj={obj}
            // eslint-disable-next-line
            {...table}
            jobId={jobId}
          />
        </Wrapper>
      </Tabs.TabPane>
      <Tabs.TabPane key={TABS.JSON} tab={TABS.JSON}>
        <JsonView
          jsonObject={obj}
          // eslint-disable-next-line
          {...view}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

JsonSwitch.propTypes = {
  // eslint-disable-next-line
  obj: PropTypes.object,
  // eslint-disable-next-line
  options: PropTypes.object,
  // eslint-disable-next-line
  jobId: PropTypes.string,
};
JsonSwitch.defaultProps = {
  obj: {},
  options: {},
};

export default JsonSwitch;
