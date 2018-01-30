// import { FlexRows, FlexColumns, AutoSize } from 'components/common/Flex.react';
import { connect } from 'react-redux';
import ContainerTable from './ContainerTable.react';
import WorkerTable from './WorkerTable.react';
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
import { init } from '../actions/config.action.js';

const { Header, Sider, Content } = Layout;
const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;
// eslint-disable-next-line
//react/prefer-stateless-function

let collapsedState = false;
const toggle = () => {
  collapsedState = !collapsedState;
};

const isVisible = false;
let prevKey = 1;
const menuSelection = (i, props) => {
  // if (prevKey != 1) {
  //   props.terminalDisconnect();
  //   props.closeTerminalClient();
  // }
  if (i.key == 1) {
    props.onMenuSelected({ visible: true, menuItem: i });
  } else {
    props.onMenuSelected({ visible: false, menuItem: i });
  }
  // if (i.key == 'vodDownMenu') {
  //   props.onVodDownPopoverClickVisible(true);
  // }
  // if (i.key == 'vodUpMenu') {
  //   props.onVodUpPopoverClickVisible(true);
  // }
  // if (i.key != 1) {
  //   setTimeout(() => {
  //     props.openTerminalClient();
  //   }, 100);
  //   props.onMenuSelected({ visible: false, menuItem: i });
  // }
  prevKey = i.key;
  // console.log(`i ${i
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
              <TableAutoComplete />
            </Col>
            <Col span={4} />
            <Col span={2} >
              <ServerSelection />
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
              <Menu.Item key="1" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">monitor</span>
              </Menu.Item>
              <Menu.Item key="2" style={{ paddingLeft: '0px' }}>
                <span className="nav-text">worker</span>
              </Menu.Item>
              <span className="ant-divider" />
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
            {/* <ContainerTable />*/}
            {props.isTableVIsible.visible ?
              <ContainerTable /> : <WorkerTable />
              // <Terminal
              //   // isClose={props.isTableVIsible.visible}
              //   inlineCommand={commandFormater(props.scriptsPath, menuKeyToCommands[props.isTableVIsible.menuItem.key])}
              //   customStyle={{ display: 'block', position: 'relative', width: '85vw', height: '85vh', opacity: 0.8 }}/>
            }
            {/* <Terminal isClose={false}/>*/}
            <TerminalModal />
          </Content>
        </Layout>
      </Layout>
    );
  }
};

const mapStateToProps = (state) => ({

  scriptsPath: state.serverSelection.currentSelection.scriptsPath
});


export default compose(connect(mapStateToProps, { init, openTerminalClient, closeTerminalClient, terminalDisconnect }),
  withState('isTableVIsible', 'onMenuSelected', { visible: true, menuItem: {} }),
  withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
  withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner);

