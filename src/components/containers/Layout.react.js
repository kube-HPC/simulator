import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import isEqual from 'lodash/isEqual';
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
import { HContent, HMenu, HLayout, HSider, LayoutHeader, AlignRow, Logo, HeaderTitle } from '../style/Styled';
import SubMenu from 'antd/lib/menu/SubMenu';
import './Layout.scss';
import { isUndefined } from 'util';
import { clearError } from '../../actions/error.action';

import { ReactComponent as LogoSvg } from '../../images/logoBordered.svg';
import { ReactComponent as DebugIcon } from '../../images/debug-icon.svg';
import { ReactComponent as DriversIcon } from '../../images/drivers-icon.svg';
import { ReactComponent as PipelineIcon } from '../../images/pipeline-icon.svg';
import { ReactComponent as WorkerIcon } from '../../images/worker-icon.svg';

const { Header, Content, Footer, Sider } = Layout;

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
    <Col span={4} offset={4}>
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

  componentDidUpdate(prevProps) {
    const errorObj = this.props.errorMessage;
    if (errorObj) {
      if (typeof errorObj === 'string') {
        message.error(errorObj);
      } else if (errorObj.message) {
        message.error(errorObj.message);
      }
      this.props.clearError();
    }
  }

  render() {
    const { props } = this;

    return (
      <HLayout>
        <SideBar open={false} />
        <HSider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <Row type="flex">
            <Col span={8}>
              <Icon className="logo" component={LogoSvg} fill="white" />
            </Col>
            {showHeader(this.state.collapsed)}
          </Row>
          <HMenu
            mode="inline"
            onSelect={i => {
              menuSelection(i, props);
            }}
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1" title={setMenuItemTitle('Jobs', props.jobsCount)}>
              {setMenuItem(<Icon type="area-chart" />, 'Jobs', props.jobsCount)}
            </Menu.Item>
            <Menu.Item key="2" title={setMenuItemTitle('Pipelines', props.pipelineCount)}>
              {setMenuItem(<Icon component={PipelineIcon} />, 'Pipelines', props.pipelineCount)}
            </Menu.Item>
            <HMenu.Item key="3" title={setMenuItemTitle('Workers', isUndefined(props.workerCount) ? 0 : props.workerCount)}>
              {setMenuItem(<Icon component={WorkerIcon} />, 'Workers', isUndefined(props.workerCount) ? 0 : props.workerCount)}
            </HMenu.Item>
            <HMenu.Item key="4" title={setMenuItemTitle('Drivers', props.driversCount)}>
              {setMenuItem(<Icon component={DriversIcon} />, 'Drivers', props.driversCount)}
            </HMenu.Item>
            <HMenu.Item key="5" title={setMenuItemTitle('Algorithms', props.algorithmCount)}>
              {setMenuItem(<Icon type="share-alt" />, 'Algorithms', props.algorithmCount)}
            </HMenu.Item>
            <HMenu.Item key="6" title={setMenuItemTitle('Debug', props.debugCount)}>
              {setMenuItem(<Icon component={DebugIcon} />, 'Debug', props.debugCount)}
            </HMenu.Item>
            <HMenu.Item key="7" title={setMenuItemTitle('Builds', props.algorithmBuildsCount)}>
              {setMenuItem(<Icon type="build" />, 'Build', props.algorithmBuildsCount)}
            </HMenu.Item>
            <SubMenu
              title={
                <span>
                  <Icon type="user" />
                  <span>Node Stats</span>
                </span>
              }
              key="8"
            >
              <HMenu.Item key="9"> CPU </HMenu.Item>
              <HMenu.Item key="10"> Memory </HMenu.Item>
            </SubMenu>
          </HMenu>
        </HSider>

        <HLayout>
          <Header className="layout-header">
            <TableAutoComplete />
          </Header>
          <HContent>
            {' '}
            <BackTop /> {selectTable(props)}{' '}
          </HContent>
        </HLayout>
      </HLayout>
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
    debugCount: (state.debugTable.dataSource || []).length,
    errorMessage: state.error.message
  };
};

LayoutInner.propTypes = {
  init: PropTypes.func.isRequired
};

export default compose(
  connect(
    mapStateToProps,
    { init, clearError }
  ),
  withState('isTableVisible', 'onMenuSelected', {
    visible: true,
    menuItem: {}
  }),
  withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
  withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner);
