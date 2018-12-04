import { connect } from 'react-redux';
import { compose, withState } from 'recompose';

import ContainerTable from './ContainerTable.react';
import WorkerTable from './WorkerTable.react';
import DebugTable from './DebugTable.react';
import StoredPipesTable from './StoredPipesTable.react';
import DriverTable from './DriverTable.react';
import AlgorithmTable from './AlgorithmsTable.react';
import { BackTop, Row, Col, Layout, Menu, Button } from 'antd';
import TableAutoComplete from './TableAutoComplete.react';
import ServerSelection from './ServerSelection.react';
import { init } from '../actions/config.action.js';
import AddPipe from './AddPipe.react';
import './Layout.css';

const { Header, Sider, Content } = Layout;

let collapsedState = false;
const toggle = () => {
  collapsedState = !collapsedState;
};

const menuSelection = (i, props) => {
  if (i.key === 1) {
    props.onMenuSelected({ visible: true, menuItem: i });
  } else {
    props.onMenuSelected({ visible: false, menuItem: i });
  }
};

const selectTable = (props) => {
  switch (props.isTableVIsible.menuItem.key) {
    case '1':
      return <StoredPipesTable/>;
    case '2':
      return <ContainerTable/>;
    case '3':
      return <WorkerTable/>;
    case '4':
      return <DriverTable/>;
    case '5':
      return <AlgorithmTable/>;
    case '6':
      return <DebugTable/>;
    default:
      return <StoredPipesTable/>;
  }
};

const LayoutInner = class extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.init();
  }
  render() {
    const { props } = this;
    return (
      <Layout>
        <Header
          style={{
            background: 'white',
            boxShadow: '5px 0 5px 0 rgba(0,0,0,0.7)',
            zIndex: '2 '
          }}>
          <Row type="flex" justify="space-between">
            <Col span={2}>
              <img src="../images/HkubeBorder.svg" alt="logo" width="50px" height="50px"
                style={{
                  margin: '4%',
                  marginRight: '10%',
                  marginLeft: '-20%'
                }}/>
              <span style={{
                margin: 'auto',
                color: '#307fe6',
                fontSize: '22px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                position: 'fixed'
              }}>HKUBE</span>
            </Col>
            <Col span={8}>
              <TableAutoComplete/>
            </Col>
            <Col span={2} style={{ textAlign: 'center' }}>
              <AddPipe style={{ margin: 'auto' }}/>
            </Col>
          </Row>
        </Header>
        <Layout>
          <Sider
            style={{ background: '#ececec' }}
            trigger={null}
            collapsible
            collapsed={collapsedState}>
            <Menu
              style={{ background: '#ececec', marginTop: '25px' }}
              mode="inline"
              onSelect={(i, k, s) => {
                menuSelection(i, props);
              }}
              defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <span className="nav-text">Stored Pipes</span>
              </Menu.Item>
              <Menu.Item key="2">
                <span className="nav-text">Jobs</span>
              </Menu.Item>
              <Menu.Item key="3">
                <span className="nav-text">Workers</span>
              </Menu.Item>
              <Menu.Item key="4" >
                <span className="nav-text">Drivers</span>
              </Menu.Item>
              <Menu.Item key="5" >
                <span className="nav-text">Algorithms</span>
              </Menu.Item>
              <Menu.Item key="6" >
                <span className="nav-text">Debug</span>
              </Menu.Item>

              <span className="ant-divider"/>
            </Menu>
          </Sider>
          <Content
            style={{
              boxShadow: 'rgba(0, 0, 0, 0.15) 4px 4px 5px 0px',
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: '89vh'
            }}>
            <BackTop/>
            {selectTable(props)}
          </Content>
        </Layout>
      </Layout>
    );
  }
};

const mapStateToProps = (state) => ({
  scriptsPath: state.serverSelection.currentSelection.scriptsPath
});

export default compose(
  connect(
    mapStateToProps,
    { init }
  ),
  withState('isTableVIsible', 'onMenuSelected', {
    visible: true,
    menuItem: {}
  }),
  withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
  withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner);
