import { Button } from 'antd';
import { JsonTable, JsonView, Tabs } from 'components/common';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
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

const removeFlowInputNull = obj => {
  if (
    Object.prototype.hasOwnProperty.call(obj, 'flowInput') &&
    obj.flowInput === null
  ) {
    const { flowInput, ...cObj } = obj;
    return cObj;
  }

  return obj;
};

const JsonSwitch = ({
  obj,
  options,
  jobId,
  jsonViewHeaderNode,
  tabPosition,
  typeDefaultView,
}) => {
  const { view = {}, table = {} } = options;
  const extra = (
    <CopyToClipboard text={stringify(obj)} onCopy={onCopy}>
      <Button type="dashed">Copy</Button>
    </CopyToClipboard>
  );

  const TabsItemsJson = useMemo(
    () => [
      {
        label: TABS.TABLE,
        key: TABS.TABLE,
        children: (
          <Wrapper>
            <JsonTable
              obj={obj}
              jobId={jobId}
              // eslint-disable-next-line
              {...table}
            />
          </Wrapper>
        ),
      },
      {
        label: TABS.JSON,
        key: TABS.JSON,
        children: (
          <>
            {jsonViewHeaderNode}
            <JsonView.Card
              jsonObject={removeFlowInputNull(obj)}
              // eslint-disable-next-line
              {...view}
            />
          </>
        ),
      },
    ],
    [jobId, jsonViewHeaderNode, obj, table, view]
  );

  return (
    <ContainerTabs>
      <Tabs
        defaultActiveKey={typeDefaultView}
        tabPosition={tabPosition}
        tabBarExtraContent={extra}
        type="card"
        items={TabsItemsJson}
      />
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
  typeDefaultView: PropTypes.string,
};
JsonSwitch.defaultProps = {
  obj: {},
  options: {},
  jobId: null,
  jsonViewHeaderNode: undefined,
  tabPosition: 'left',
  typeDefaultView: TABS.JSON,
};

export default JsonSwitch;
