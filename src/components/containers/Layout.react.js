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
import { BackTop, Row, Col, Tag, Alert } from 'antd';
import TableAutoComplete from '../dumb/TableAutoComplete.react';
import { init } from '../../actions/config.action.js';
import {
  HContent,
  HMenu,
  HLayout,
  HSider,
  LayoutHeader,
  AlignRow,
  Logo,
  HeaderTitle
} from '../style/Styled';
import SubMenu from 'antd/lib/menu/SubMenu';
import './Layout.scss';
import { isUndefined } from 'util';

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
  componentDidMount() {
    this.props.init();
  }

  render() {
    const { props } = this;

    const showAlert = message => {
      const alertComponent = (
        <Alert
          message={props.errorMessage}
          type="error"
          showIcon
          className="alert"
          closable={true}
          description={'Description'}
        />
      );
      return message ? [alertComponent] : [];
    };

    return (
      <HLayout>
        <SideBar open={false} />
        <LayoutHeader>
          <AlignRow type="flex" align="top" justify="space-between">
            <Col span={4}>
              <Row gutter={3}>
                <Col span={4}>
                  <Logo />
                </Col>
                <Col span={2}>
                  <HeaderTitle>Hkube</HeaderTitle>
                </Col>
              </Row>
            </Col>
            <Col>
              <TableAutoComplete />
            </Col>
          </AlignRow>
        </LayoutHeader>
        {showAlert(props.errorMessage)}
        <HLayout hasSider={true}>
          <HSider>
            <HMenu
              mode="inline"
              onSelect={i => {
                menuSelection(i, props);
              }}
              defaultSelectedKeys={['1']}
            >
              <HMenu.Item key="1">
                <Row type="flex" justify="space-between">
                  <Col>Jobs</Col>
                  <Col>
                    <Tag className="tag">{props.jobsCount}</Tag>
                  </Col>
                </Row>
              </HMenu.Item>
              <HMenu.Item key="2">
                <Row type="flex" justify="space-between">
                  <Col>Pipelines</Col>
                  <Col>
                    <Tag className="tag">{props.pipelineCount}</Tag>
                  </Col>
                </Row>
              </HMenu.Item>
              <HMenu.Item key="3">
                <Row type="flex" justify="space-between">
                  <Col>Workers</Col>
                  <Col>
                    <Tag className="tag">
                      {isUndefined(props.workerCount) ? 0 : props.workerCount}
                    </Tag>
                  </Col>
                </Row>
              </HMenu.Item>
              <HMenu.Item key="4">
                <Row type="flex" justify="space-between">
                  <Col>Drivers</Col>
                  <Col>
                    <Tag className="tag">{props.driversCount}</Tag>
                  </Col>
                </Row>
              </HMenu.Item>
              <HMenu.Item key="5">
                <Row type="flex" justify="space-between">
                  <Col>Algorithms</Col>
                  <Col>
                    <Tag className="tag">{props.algorithmCount}</Tag>
                  </Col>
                </Row>
              </HMenu.Item>
              <HMenu.Item key="6">
                <Row type="flex" justify="space-between">
                  <Col>Debug</Col>
                  <Col>
                    <Tag className="tag">{props.debugCount}</Tag>
                  </Col>
                </Row>
              </HMenu.Item>
              <HMenu.Item key="7">
                <Row type="flex" justify="space-between">
                  <Col>Builds</Col>
                  <Col>
                    <Tag className="tag">{props.algorithmBuildsCount}</Tag>
                  </Col>
                </Row>
              </HMenu.Item>
              <SubMenu
                title={
                  <span>
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
    errorMessage: state.error.message || ''
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
