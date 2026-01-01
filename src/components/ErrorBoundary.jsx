import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-cycle
import { GrafanaLink } from 'components';
import { RedoOutlined, GithubOutlined } from '@ant-design/icons';

import { Result, Button, Typography, Collapse } from 'antd';
import styled from 'styled-components';

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

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    const { hasError, error, info } = this.state;
    const { children = null } = this.props;

    return hasError ? (
      <CenterPage>
        <Result
          status="error"
          title="Oops... Something went wrong"
          subTitle={
            <>
              <Paragraph style={{ marginBottom: 10 }}>
                To see more details about the system status you can access
                grafana,please click on <GrafanaLink />
              </Paragraph>
              <Paragraph style={{ marginBottom: 0 }}>
                Please <Text strong>refresh</Text> the page, you can report the
                error on{' '}
                <Text strong>
                  Github <GithubOutlined onClick={openGithub} />{' '}
                </Text>
              </Paragraph>
            </>
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

export default ErrorBoundary;
