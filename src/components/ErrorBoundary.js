import React from 'react';
import PropTypes from 'prop-types';

import { RedoOutlined, GithubOutlined } from '@ant-design/icons';

import { Result, Button, Typography, Collapse } from 'antd';
import styled from 'styled-components';
import { Icons, FlexBox } from 'components/common';

const CenterPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CollapseFull = styled(Collapse)`
  width: 100%;
`;

const { Paragraph, Text } = Typography;
const { Panel } = Collapse;

const reloadPage = () => window.location.reload();
const openGithub = () =>
  window.open('https://github.com/kube-HPC/hkube/issues');

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: { message: '', stack: '' },
    info: { componentStack: '' },
  };

  static getDerivedStateFromError = () => ({ hasError: true });

  componentDidCatch = (error, info) => {
    this.setState({ error, info });
  };

  render() {
    const { hasError, error, info } = this.state;
    const { children } = this.props;

    return hasError ? (
      <CenterPage>
        <Result
          status="error"
          title="Oops... Something went wrong"
          subTitle={
            <FlexBox>
              <FlexBox.Item>
                <Paragraph style={{ marginBottom: 0 }}>
                  Please <Text strong>refresh</Text> the page, you can report
                  the error on <Text strong>Github</Text>
                </Paragraph>
              </FlexBox.Item>
              <FlexBox.Item>
                <Icons.Hover type={<GithubOutlined />} onClick={openGithub} />
              </FlexBox.Item>
            </FlexBox>
          }
          extra={[
            <Button
              type="primary"
              icon={<RedoOutlined />}
              key="refresh"
              onClick={reloadPage}>
              Refresh
            </Button>,
          ]}>
          <CollapseFull>
            <Panel header="Error Message" key="1">
              <Paragraph copyable>
                <pre>{error.message}</pre>
              </Paragraph>
            </Panel>
            <Panel header="Error Stack" key="2">
              <Paragraph copyable>
                <pre>{error.stack}</pre>
              </Paragraph>
            </Panel>
            <Panel header="Error info" key="3">
              <Paragraph copyable>
                <pre>{info.componentStack}</pre>
              </Paragraph>
            </Panel>
          </CollapseFull>
        </Result>
      </CenterPage>
    ) : (
      children
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  children: null,
};

export default ErrorBoundary;
