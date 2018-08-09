import { connect } from 'react-redux';
import ContainerTable from './ContainerTable.react';
import WorkerTable from './WorkerTable.react';
import DebugTable from './DebugTable.react';
import DriverTable from './DriverTable.react';
import AlgorithmTable from './AlgorithmsTable.react';
import { BackTop, Row, Col, Layout, Menu ,Button } from 'antd';
import TableAutoComplete from './TableAutoComplete.react';
import { compose, withState } from 'recompose';
import ServerSelection from './ServerSelection.react';

import { init } from '../actions/config.action.js';
<ServerSelection/>
const { Header, Sider, Content } = Layout;

let collapsedState = false;
const toggle = () => {
  collapsedState = !collapsedState;
};

const menuSelection = (i, props) => {
  if (i.key == 1) {
    props.onMenuSelected({ visible: true, menuItem: i });
  } else {
    props.onMenuSelected({ visible: false, menuItem: i });
  }
};

const selectTable = (props) => {
  switch (props.isTableVIsible.menuItem.key) {
    case '1':
      return <ContainerTable/>;
    case '2':
      return <WorkerTable/>;
    case '3':
      return <DriverTable/>;
    case '4':
      return <AlgorithmTable/>;
    case '5':
      return <DebugTable/>;
    default:
      return <DebugTable/>;
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
            background: '#4285f4',
            boxShadow: '5px 0 5px 0 rgba(0,0,0,0.7)',
            zIndex: '2 '
          }}>
          <Row type="flex" justify="start" align="middle">
            <Col span={2} style={{ color: 'white', fontSize: '18px' }} > HKUBE</Col>
            <Col span={10} offset={6}>
              <TableAutoComplete/>
            </Col>
            <Col span={4}/>
            <Col span={2} >
        
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
                // console.log(`i ${i} k ${k} s ${s} `)
              }}
              defaultSelectedKeys={['5']}>
              <Menu.Item key="1" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">jobs</span>
              </Menu.Item>
              <Menu.Item key="2" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">workers</span>
              </Menu.Item>
              <Menu.Item key="3" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">drivers</span>
              </Menu.Item>
              <Menu.Item key="4" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">algorithms</span>
              </Menu.Item>
              <Menu.Item key="5" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">Debug</span>
              </Menu.Item>
              <span className="ant-divider"/>
            </Menu>
          </Sider>
          <Content
            style={{
              boxShadow: '0px 0px 5px 0 rgba(0,0,0, 0.15)',
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: '89vh'
            }}>
            <BackTop/>
            {/* <ContainerTable />*/}
            {selectTable(props)}
            {/* {props.isTableVIsible.visible ?
              <ContainerTable /> : <WorkerTable />
              
            } */}
          </Content>
        </Layout>
      </Layout>
    );
  }
};

const mapStateToProps = (state) => ({

  scriptsPath: state.serverSelection.currentSelection.scriptsPath
});


export default compose(connect(mapStateToProps, { init }),
  withState('isTableVIsible', 'onMenuSelected', { visible: true, menuItem: {} }),
  withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
  withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner);

