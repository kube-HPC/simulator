import React, { useState } from 'react';
import { Button, Form, Input, Typography, Checkbox } from 'antd';
import { FlexBox } from 'components/common';
import KeycloakServices from '../../../keycloak';

const { Title } = Typography;

const FormLogin = () => {
  const { initKeycloak } = KeycloakServices;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onFinishFailed = errorInfo => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const onFinish = () => {
    // event.preventDefault();
    /* keycloak
      .init({ onLoad: 'login-required' })
      .then(authenticated => {
        // console.log(authenticated);
        if (authenticated) {
          keycloak
            .login({
              username,
              password,
              grantType: 'password',
              clientId: keycloak.clientId,
            })
            .catch(() => {
              //   console.error('Failed to login:', error);
            });
        } else {
          //  console.log('User not authenticated');
        }
      })
      .catch(error => {
        console.error('Failed to initialize Keycloak:', error);
      }); */

    initKeycloak(<>login</>, <>error</>, username, password);
  };

  return (
    <FlexBox>
      <div>
        <Title level={3} style={{ margin: '0px' }}>
          Welcome to Hkube
        </Title>
        <div
          style={{
            fontSize: '11px',
            paddingBottom: '20px',
            color: 'GrayText',
          }}>
          please enter login details below.
        </div>
      </div>

      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          width: '90%',
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}>
          <Input value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}>
          <Input.Password
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </FlexBox>
  );
};
export default FormLogin;
