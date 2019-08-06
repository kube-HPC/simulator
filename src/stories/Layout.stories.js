import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { storiesOf } from '@storybook/react';

const { Header, Footer, Sider, Content } = Layout;

storiesOf('Basics|Layout', module).add('Skeleton', () => (
  <Layout>
    <Sider>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1">
          <Icon type="pie-chart" />
          <span>Option 1</span>
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Content>Content</Content>
        <Sider>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  </Layout>
));
