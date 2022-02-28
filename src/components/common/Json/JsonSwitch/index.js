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
const ContainerTabs = styled.div`
  .ant-tabs-nav .ant-tabs-nav-wrap {
    flex: inherit;
  }
  .ant-tabs-extra-content {
    margin-left: auto;
  }
`;

const onCopy = () =>
  notification({
    message: 'JSON Copied to Clipboard',
    type: notification.TYPES.SUCCESS,
  });

const JsonSwitch = ({
  obj,
  options,
  jobId,
  jsonViewHeaderNode,
  tabPosition,
}) => {
  const { view = {}, table = {} } = options;
  const extra = (
    <CopyToClipboard text={stringify(obj)} onCopy={onCopy}>
      <Button type="dashed">Copy</Button>
    </CopyToClipboard>
  );
  return (
    <ContainerTabs>
      <Tabs tabPosition={tabPosition} tabBarExtraContent={extra} type="card">
        <Tabs.TabPane key={TABS.TABLE} tab={TABS.TABLE}>
          <Wrapper>
            <JsonTable
              obj={obj}
              jobId={jobId}
              // eslint-disable-next-line
              {...table}
            />
          </Wrapper>
        </Tabs.TabPane>
        <Tabs.TabPane key={TABS.JSON} tab={TABS.JSON}>
          {jsonViewHeaderNode}
          <JsonView.Card
            jsonObject={obj}
            // eslint-disable-next-line
            {...view}
          />
        </Tabs.TabPane>
      </Tabs>
    </ContainerTabs>
  );
};

JsonSwitch.propTypes = {
  // eslint-disable-next-line
  obj: PropTypes.shape({ view: PropTypes.object, table: PropTypes.object }),
  // eslint-disable-next-line
  options: PropTypes.object,
  jobId: PropTypes.string,
  jsonViewHeaderNode: PropTypes.node,
  tabPosition: PropTypes.string,
};
JsonSwitch.defaultProps = {
  obj: {},
  options: {},
  jobId: null,
  jsonViewHeaderNode: undefined,
  tabPosition: 'left',
};

export default JsonSwitch;
