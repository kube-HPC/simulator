import React from 'react';
import { Form, Select, InputNumber, DatePicker, Switch, Slider } from 'antd';

import { BackTop, Row, Col, Layout, Menu, Button } from 'antd';
const { Header, Sider, Content } = Layout;
const { Option } = Select;

const App = () => (
  <Layout>
        <Header
          style={{
            background: '#4285f4',
            boxShadow: '5px 0 5px 0 rgba(0,0,0,0.7)',
            zIndex: '2 '
          }}>
          <Row type="flex" justify="start" align="middle">
            <Col
              span={2}
              style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>
              {' '}
              HKUBE
            </Col>
            <Col span={10} offset={6}>
              {/* <TableAutoComplete/> */}
            </Col>
            <Col span={2}>
              {/* <ServerSelection/> */}
            </Col>
            <Col span={4}>
              {/* <AddPipe/> */}
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider
            style={{ background: '#ececec' }}
            trigger={null}
            collapsible
        //  collapsed={collapsedState}
         >
            <Menu
              style={{ background: '#ececec', marginTop: '25px' }}
              mode="inline"
              onSelect={(i, k, s) => {
             //   menuSelection(i, props);
                // console.log(`i ${i} k ${k} s ${s} `)
              }}
              defaultSelectedKeys={['1']}>
              <Menu.Item key="1" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">Jobs</span>
              </Menu.Item>
              <Menu.Item key="2" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">Workers</span>
              </Menu.Item>
              <Menu.Item key="3" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">Drivers</span>
              </Menu.Item>
              <Menu.Item key="4" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">Algorithms</span>
              </Menu.Item>
              <Menu.Item key="5" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">Debug</span>
              </Menu.Item>
              <Menu.Item key="6" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">Stored Pipes</span>
              </Menu.Item>
              <span className="ant-divider"/>
            </Menu>
          </Sider>
          {/* <Content
            style={{
              boxShadow: '0px 0px 5px 0 rgba(0,0,0, 0.15)',
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: '89vh'
            }}> */}
            <BackTop/>
            {/* <ContainerTable />*/}
          
            {/* {props.isTableVIsible.visible ?
              <ContainerTable /> : <WorkerTable />
              
            } */}
          {/* </Content> */}
        </Layout>
      </Layout>
    );
export default App;
