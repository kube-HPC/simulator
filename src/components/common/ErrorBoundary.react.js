import React from 'react';
import { Result, Button, Typography, Row, Col, Card } from 'antd';
import styled from 'styled-components';

const CenterPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const { Paragraph, Text } = Typography;

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: { message: '', stack: '' },
    info: { componentStack: '' }
  };

  static getDerivedStateFromError = error => {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  };

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
            <Paragraph>
              Please <Text strong>refresh</Text> the page, you can report the error on{' '}
              <a href="https://github.com/kube-HPC/hkube/issues">Github</a>
            </Paragraph>
          }
          extra={[
            <Button
              type="primary"
              icon="redo"
              key="refresh"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          ]}
        >
          <Row type="flex" gutter={10}>
            <Col style={{ width: '50%' }}>
              <Card title={<>Error: {<Text code>{error.message}</Text>}</>}>
                <Paragraph copyable type="secondary">
                  {error.stack}
                </Paragraph>
              </Card>
            </Col>
            <Col style={{ width: '50%' }}>
              <Card title={`Info`}>
                <Paragraph copyable type="secondary">
                  {info.componentStack}
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </Result>
      </CenterPage>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
