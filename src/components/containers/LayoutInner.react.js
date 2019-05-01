import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import ContainerTable from './tables/ContainerTable.react';
import WorkerTable from './tables/WorkerTable.react';
import DebugTable from './tables/DebugTable.react';
import AlgorithmBuildsTable from './tables/AlgorithmBuildsTable.react';
import StoredPipesTable from './tables/StoredPipesTable.react';
import DriverTable from './tables/DriverTable.react';
import AlgorithmTable from './tables/AlgorithmsTable.react';
import NodeStatistics from './NodeStatistics.react';
import SideBar from './SideBarContainer.react';
import TableAutoComplete from '../dumb/TableAutoComplete.react';
import AnimatedHeader from '../dumb/AnimatedHeader.react';
import { init } from '../../actions/config.action.js';
import { BackTop, Row, Col, Tag, message, Layout, Icon, Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import './Layout.scss';
import { isUndefined } from 'util';
import { ReactComponent as LogoSvg } from '../../images/logoBordered.svg';
import { ReactComponent as DebugIcon } from '../../images/debug-icon.svg';
import { ReactComponent as DriversIcon } from '../../images/drivers-icon.svg';
import { ReactComponent as PipelineIcon } from '../../images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from '../../images/worker-icon.svg';
import { ReactComponent as AlgorithmIcon } from '../../images/algorithm-icon.svg';

import MenuIcon from 'components/dumb/MenuIcon.react';

import styled from 'styled-components';

const { Header, Content, Sider } = Layout;

const LayoutStyled = styled(Layout)`
  height: 100vh;
`;

const HeaderStyled = styled(Header)`
  background: white;
  border-bottom: 1pt solid #ccc;
  text-align: center;
`;

const IconLogo = styled(Icon)`
  margin: 16px;
  text-align: center;
  font-size: 50px;
  color: transparent;
  width: -webkit-fill-available;
`;

const ContentStyled = styled(Content)`
  background: white;
  min-height: auto;
`;

const SiderStyled = styled(Sider)`
  background: #ececec;
`;

const MenuStyled = styled(Menu)`
  background: #ececec;

  .ant-layout-sider-trigger {
    color: #2f8ee6;
    background: #dedede87;
  }
`;

const showHeader = isCollapsed =>
  isCollapsed ? (
    <div />
  ) : (
    <Col span={12} style={{ margin: 'auto' }}>
      <AnimatedHeader />
    </Col>
  );

const setMenuItemTitle = (title, count) => (
  <div>
    {title} <Tag className="tag">{count}</Tag>
  </div>
);

const setMenuItem = (iconComponent, title, count) => (
  <Row type="flex" justify="start">
    <Col>{iconComponent} </Col>
    <Col span={12}>{title}</Col>
    <Col span={3} offset={3}>
      <Tag className="tag">{count}</Tag>
    </Col>
  </Row>
);

const menuSelection = (i, props) => {
  if (i.key === 1) {
    props.onMenuSelected({ visible: true, menuItem: i });
  } else {
    props.onMenuSelected({ visible: false, menuItem: i });
  }
};

const selectTable = props => {
  switch (props.isTableVisible.menuItem.key) {
    case '1':
      return <ContainerTable />;
    case '2':
      return <StoredPipesTable />;
    case '3':
      return <WorkerTable />;
    case '4':
      return <DriverTable />;
    case '5':
      return <AlgorithmTable />;
    case '6':
      return <DebugTable />;
    case '7':
      return <AlgorithmBuildsTable />;
    case '9':
      return <NodeStatistics metric="cpu" />;
    case '10':
      return <NodeStatistics metric="mem" />;
    default:
      return <ContainerTable />;
  }
};

class LayoutInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: true };
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    this.props.init();
    message.config({
      duration: 5,
      maxCount: 3
    });
  }

  render() {
    const { props } = this;

    return (
      <LayoutStyled>
        <SideBar open={false} />
        <SiderStyled collapsible onCollapse={this.onCollapse} collapsed={this.state.collapsed}>
          <Row type="flex">
            <Col span={8}>
              <IconLogo component={LogoSvg} fill="white" />
            </Col>
            {showHeader(this.state.collapsed)}
          </Row>
          <MenuStyled
            mode="inline"
            onSelect={i => {
              menuSelection(i, props);
            }}
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1" title={setMenuItemTitle('Jobs', props.jobsCount)}>
              {setMenuItem(<MenuIcon type="area-chart" />, 'Jobs', props.jobsCount)}
            </Menu.Item>
            <Menu.Item key="2" title={setMenuItemTitle('Pipelines', props.pipelineCount)}>
              {setMenuItem(<MenuIcon type={PipelineIcon} />, 'Pipelines', props.pipelineCount)}
            </Menu.Item>
            <Menu.Item
              key="3"
              title={setMenuItemTitle(
                'Workers',
                isUndefined(props.workerCount) ? 0 : props.workerCount
              )}
            >
              {setMenuItem(
                <MenuIcon type={WorkerIcon} />,
                'Workers',
                isUndefined(props.workerCount) ? 0 : props.workerCount
              )}
            </Menu.Item>
            <Menu.Item key="4" title={setMenuItemTitle('Drivers', props.driversCount)}>
              {setMenuItem(<MenuIcon type={DriversIcon} />, 'Drivers', props.driversCount)}
            </Menu.Item>
            <Menu.Item key="5" title={setMenuItemTitle('Algorithms', props.algorithmCount)}>
              {setMenuItem(<MenuIcon type={AlgorithmIcon} />, 'Algorithms', props.algorithmCount)}
            </Menu.Item>
            <Menu.Item key="6" title={setMenuItemTitle('Debug', props.debugCount)}>
              {setMenuItem(<MenuIcon type={DebugIcon} />, 'Debug', props.debugCount)}
            </Menu.Item>
            <Menu.Item key="7" title={setMenuItemTitle('Builds', props.algorithmBuildsCount)}>
              {setMenuItem(<MenuIcon type={'build'} />, 'Build', props.algorithmBuildsCount)}
            </Menu.Item>
            <SubMenu
              title={
                <span>
                  <MenuIcon type={'line-chart'} />
                  <span>Node Stats</span>
                </span>
              }
              key="8"
            >
              <Menu.Item key="9"> CPU </Menu.Item>
              <Menu.Item key="10"> Memory </Menu.Item>
            </SubMenu>
          </MenuStyled>
        </SiderStyled>

        <LayoutStyled>
          <HeaderStyled>
            <TableAutoComplete />
          </HeaderStyled>
          <ContentStyled>
            <BackTop />
            {selectTable(props)}
          </ContentStyled>
        </LayoutStyled>
      </LayoutStyled>
    );
  }
}

const mapStateToProps = state => {
  return {
    scriptsPath: state.serverSelection.currentSelection.scriptsPath,
    jobsCount: (state.containerTable.dataSource || []).length,
    driversCount: (state.driverTable.dataSource || []).length,
    algorithmCount: (state.algorithmTable.dataSource || []).length,
    algorithmBuildsCount: (state.algorithmBuildsTable.dataSource || []).length,
    pipelineCount: (state.storedPipeline.dataSource || []).length,
    workerCount: (state.workerTable.stats || { total: 0 }).total,
    debugCount: (state.debugTable.dataSource || []).length
  };
};

LayoutInner.propTypes = {
  init: PropTypes.func.isRequired
};

export default compose(
  connect(
    mapStateToProps,
    { init }
  ),
  withState('isTableVisible', 'onMenuSelected', {
    visible: true,
    menuItem: {}
  }),
  withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
  withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner);
