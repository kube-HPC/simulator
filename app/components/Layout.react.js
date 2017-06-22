// import { FlexRows, FlexColumns, AutoSize } from 'components/common/Flex.react';
import { connect } from 'react-redux';
import ContainerTable from './ContainerTable.react';
import TerminalModal from './TerminalModal.react';
import PopoverConfirmOperation from './PopoverConfirmOperation.react';
import Terminal from './Terminal';
import TableAutoComplete from './TableAutoComplete.react';
import { BackTop } from 'antd';
import { Layout, Menu, Icon, Button } from 'antd';
import { Row, Col } from 'antd';
import { compose, withState } from 'recompose';
import { openTerminalClient, closeTerminalClient, terminalDisconnect } from '../actions/terminal.action';
import { menuKeyToCommands, commandFormater } from '../helpers/menuToCommands';
import ServerSelection from './ServerSelection.react';
const { Header, Sider, Content } = Layout;
const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;
// eslint-disable-next-line
//react/prefer-stateless-function

let collapsedState = false;
let toggle = () => {
  collapsedState = !collapsedState;
};

let isVisible = false;
let prevKey = 1;
let menuSelection = (i, props) => {
  if (prevKey != 1) {
    props.terminalDisconnect();
    props.closeTerminalClient();
  }
  if (i.key == 1) {
    props.onMenuSelected({ visible: true, menuItem: i })
  }
  if (i.key == 'vodDownMenu') {
    props.onVodDownPopoverClickVisible(true)
  }
  if (i.key == 'vodUpMenu') {
    props.onVodUpPopoverClickVisible(true)
  }
  if (i.key != 1) {
    setTimeout(() => {
      props.openTerminalClient();
    }, 100)
    props.onMenuSelected({ visible: false, menuItem: i })
  }
  prevKey = i.key;
  // console.log(`i ${i
}
let LayoutInner = (props) => (
  <Layout>
    <Header
      style={{
        background: '#4285f4',
        boxShadow: '5px 0 5px 0 rgba(0,0,0,0.7)',
        zIndex: '2 '
      }}>
      <Row type="flex" justify="start" align="middle">
        <Col span={2} style={{color:'white',fontSize:'18px'}} > RMS monitor</Col>
        <Col span={10} offset={6}>
          <TableAutoComplete />
        </Col>
        <Col span={4} ></Col>
        <Col span={2} >
          <ServerSelection></ServerSelection>
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
          defaultSelectedKeys={['1']}>
          <Menu.Item key="1" style={{ paddingLeft: '0px', }}>
            <span className="nav-text">contaniers</span>
          </Menu.Item>
          {/*<SubMenu key="sub1" style={{ backgroundColor: '#ececec' }}  title={<span>contaniers</span>}>*/}
          <span className="ant-divider" />
          <MenuItemGroup style={{ backgroundColor: '#ececec' }} title="RMS operations">
            <Menu.Item key="versions">
              <span className="nav-text"> rms microservices versions </span>
            </Menu.Item>
            <Menu.Item key="nodesChechk">
              <span className="nav-text"> check nodes liveness(ping$ssh) </span>
            </Menu.Item>
            <Menu.Item key="redisMasterIp">
              <span className="nav-text">redis master ip </span>
            </Menu.Item>
            <Menu.Item key="redisMasterPod">
              <span className="nav-text">current redis master pod</span>
            </Menu.Item>
            <Menu.Item key="vodDownMenu">
              <PopoverConfirmOperation
                isVisible={props.isVodDownVisible}
                onConfirm={() => {
                  menuSelection({ key: 'vodDown' }, props)
                  // commandFormater(menuKeyToCommands["vodDown"])
                  props.onVodDownPopoverClickVisible(false)
                }}
                onCancel={() => {
                  props.onVodDownPopoverClickVisible(false)
                }}
                position="right" >
                <div style={{ width: '120%' }}>
                  <span className="nav-text">vod down</span>
                </div>
              </PopoverConfirmOperation>
            </Menu.Item>
            <Menu.Item key="vodUpMenu">
              <PopoverConfirmOperation
                isVisible={props.isVodUpVisible}
                onConfirm={() => {
                  //   commandFormater(menuKeyToCommands["vodUp"])
                  menuSelection({ key: 'vodUp' }, props)
                  props.onVodUpPopoverClickVisible(false)
                }}
                onCancel={() => {
                  props.onVodUpPopoverClickVisible(false)
                }}
                position="right">
                <div style={{ width: '120%' }}>
                  <span className="nav-text">vod up</span>
                </div>
              </PopoverConfirmOperation>
            </Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup style={{ backgroundColor: '#ececec' }} title="Kubernetes opeations">
            <Menu.Item key="pods">
              <span className="nav-text">pods</span>
            </Menu.Item>
            <Menu.Item key="info">
              <span className="nav-text">services url</span>
            </Menu.Item>
            <Menu.Item key="svc">
              <span className="nav-text">services</span>
            </Menu.Item>
            <Menu.Item key="rc">
              <span className="nav-text">replication controller</span>
            </Menu.Item>
            <Menu.Item key="deployments">
              <span className="nav-text">deployments</span>
            </Menu.Item>
            <Menu.Item key="apiServer">
              <span className="nav-text">api-server</span>
            </Menu.Item>
            <Menu.Item key="pv">
              <span className="nav-text">persistent volume</span>
            </Menu.Item>
            <Menu.Item key="pvc">
              <span className="nav-text">persistent volume claim</span>
            </Menu.Item>
            <Menu.Item key="events">
              <span className="nav-text"> k8s events </span>
            </Menu.Item>
          </MenuItemGroup>
          {/*</SubMenu>*/}
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
        <BackTop />
        {/*<ContainerTable />*/}
        {props.isTableVIsible.visible ?
          <ContainerTable /> :
          <Terminal
            // isClose={props.isTableVIsible.visible}
            inlineCommand={commandFormater(menuKeyToCommands[props.isTableVIsible.menuItem.key])}
            customStyle={{ display: 'block', position: 'relative', width: '85vw', height: '85vh', opacity: 0.8 }}
          />
        }
        {/*<Terminal isClose={false}/>*/}
        <TerminalModal />
      </Content>
    </Layout>
  </Layout>
);

/* <div>
      <BackTop />
      <ContainerTable />
    </div>*/


export default compose(connect(null, { openTerminalClient, closeTerminalClient, terminalDisconnect }),
  withState('isTableVIsible', 'onMenuSelected', { visible: true, menuItem: {} }),
  withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
  withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner)

