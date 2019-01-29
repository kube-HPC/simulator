import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import ContainerTable from './tables/ContainerTable.react';
import WorkerTable from './tables/WorkerTable.react';
import DebugTable from './tables/DebugTable.react';
import StoredPipesTable from './tables/StoredPipesTable.react';
import DriverTable from './tables/DriverTable.react';
import AlgorithmTable from './tables/AlgorithmsTable.react';
import NodeStatistics from './NodeStatistics.react';
import SideBar from './SideBarContainer.react';
import { BackTop, Row, Col, Tag } from 'antd';
import TableAutoComplete from '../dumb/TableAutoComplete.react';
import { init } from '../../actions/config.action.js';
import { addPipe } from '../../actions/addPipe.action';
import HEditor from './HEditor.react';
import { HContent, HMenu, HLayout, HSider, LayoutHeader, AlignRow, Logo, HeaderTitle, ButtonAddPipeline } from '../style/Styled';
import template from '../stubs/json-object.json';
import SubMenu from 'antd/lib/menu/SubMenu';
import './Layout.scss'
const jsonTemplate = JSON.stringify(template, null, 2);

const menuSelection = (i, props) => {
    if (i.key === 1) {
        props.onMenuSelected({ visible: true, menuItem: i });
    }
    else {
        props.onMenuSelected({ visible: false, menuItem: i });
    }
};

const selectTable = (props) => {
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
        case '8':
            return <NodeStatistics metric='cpu' />;
        case '9':
            return <NodeStatistics metric='mem' />;
        default:
            return <ContainerTable />;
    }
};
class LayoutInner extends React.Component {
    componentWillMount() {
        this.props.init();
    }
    render() {
        const { props } = this;

        return (
          <HLayout>
            <SideBar
              open={false} />
            <LayoutHeader>
              <AlignRow type="flex" align="top" justify="space-between">
                <Col span={4}>
                  <Row gutter={3}>
                    <Col span={4}> <Logo /> </Col>
                    <Col span={2}> <HeaderTitle>Hkube</HeaderTitle> </Col>
                  </Row>
                </Col>
                <Col> <TableAutoComplete /> </Col>
                <Col>
                  <HEditor
                    jsonTemplate={jsonTemplate}
                    styledButton={(onClick) => <ButtonAddPipeline onClick={onClick}> + Pipeline </ButtonAddPipeline>}
                    title={'Add Pipeline Editor'}
                    okText={'Store Pipeline'}
                    hintText={<div> Hint: Type <strong>node</strong> for adding pipe-node.</div>}
                    action={this.props.addPipe}
                            />
                </Col>
              </AlignRow>
            </LayoutHeader>

            <HLayout hasSider={true}>
              <HSider>
                <HMenu mode="inline" onSelect={(i) => { menuSelection(i, props) }} defaultSelectedKeys={['1']}>
                  <HMenu.Item key="1"> Jobs </HMenu.Item>
                  {/* <HMenu.Item key="2"> Stored Pipelines </HMenu.Item> */}
                  {/* <HMenu.Item key="2"> <Badge count={props.algorithmCount} offset={[15,0]} style={{scale: "0.8", background:"#0090fa"}}>Pipelines</Badge></HMenu.Item> */}
                  <HMenu.Item key="2"><span>
                                Pipelines
                    <Tag color={'blue'} style={{ marginLeft: "42px" }}>{props.pipelineCount}</Tag>
                  </span>
                  </HMenu.Item>
                  {/* <HMenu.Item key="3"> <Badge count={} offset={[10,5]} style={{scale: "0.8", background:"#0090fa"}}>Workers</Badge></HMenu.Item> */}
                  <HMenu.Item key="3"><span>
                                Workers
                    <Tag color={'blue'} style={{ marginLeft: "60px" }}>{props.workerCount}</Tag>
                  </span>
                  </HMenu.Item>
                  {/* <HMenu.Item key="4"> <Badge count={props.driversCount} offset={[15,7]} style={{scale: "0.8",background:"#0090fa"}}>Drivers</Badge></HMenu.Item> */}
                  <HMenu.Item key="4"><span>
                                Drivers
                    <Tag color={'blue'} style={{ marginLeft: "60px" }}>{props.driversCount}</Tag>
                  </span>
                  </HMenu.Item>

                  {/* <HMenu.Item key="5"> <Badge count={props.algorithmCount} offset={[15,0]} style={{scale: "0.8",background:"#0090fa"}}>Algorithms</Badge></HMenu.Item> */}
                  <HMenu.Item key="5"><span>
                                Algorithms
                    <Tag color={'blue'} style={{ marginLeft: "35px" }}>{props.algorithmCount}</Tag>
                  </span>
                  </HMenu.Item>

                  <HMenu.Item key="6"> Debug </HMenu.Item>
                  <SubMenu  title={<span><span>Node Stats</span></span>} key="7">
                    <HMenu.Item key="8" > CPU </HMenu.Item>
                    <HMenu.Item key="9" > Memory </HMenu.Item>
                 
                  </SubMenu>
                </HMenu>
              </HSider>
              <HContent> <BackTop /> {selectTable(props)} </HContent>
            </HLayout>
          </HLayout >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        scriptsPath: state.serverSelection.currentSelection.scriptsPath,
        driversCount: (state.driverTable.dataSource || []).length,
        algorithmCount: (state.algorithmTable.dataSource || []).length,
        pipelineCount: (state.storedPipeline.dataSource || []).length,
        workerCount: (state.workerTable.stats || {}).total,
    }
};

LayoutInner.propTypes = {
    init: PropTypes.func.isRequired,
    addPipe: PropTypes.func.isRequired,
};

export default compose(connect(mapStateToProps, { init, addPipe }),
    withState('isTableVisible', 'onMenuSelected', { visible: true, menuItem: {} }),
    withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
    withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner);
