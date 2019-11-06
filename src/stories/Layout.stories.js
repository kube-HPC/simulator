import { Icon, Layout, Menu } from 'antd';
import React from 'react';
import { SB_SECTIONS } from 'const';

const { Header, Footer, Sider, Content } = Layout;

export default {
  title: `${SB_SECTIONS.PLAYGROUND}|Layout Skeleton`
};

export const Default = () => (
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
);
