import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose, withState} from 'recompose';
import ContainerTable from './tables/ContainerTable.react';
import WorkerTable from './tables/WorkerTable.react';
import DebugTable from './tables/DebugTable.react';
import StoredPipesTable from './tables/StoredPipesTable.react';
import DriverTable from './tables/DriverTable.react';
import AlgorithmTable from './tables/AlgorithmsTable.react';
import {BackTop, Row, Col } from 'antd';
import TableAutoComplete from '../dumb/TableAutoComplete.react';
import {init} from '../../actions/config.action.js';
import {addPipe} from '../../actions/addPipe.action';
import HEditor from './HEditor.react';
import {HContent, HMenu, HLayout, HSider, LayoutHeader, AlignRow, Logo, HeaderTitle} from '../style/Styled';
import template from '../stubs/json-object.json';
import {ButtonAddPipeline} from '../style/Styled'

const jsonTemplate = JSON.stringify(template, null, 2);

const menuSelection = (i, props) => {
    if (i.key === 1) {
        props.onMenuSelected({visible: true, menuItem: i});
    }
    else {
        props.onMenuSelected({visible: false, menuItem: i});
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
    default:
        return  <ContainerTable />;
    }
};
class LayoutInner extends React.Component {
    componentWillMount() {
        this.props.init();
    }
    render() {
        const {props} = this;

        return (
          <HLayout>
            <LayoutHeader>
              <AlignRow type="flex" align="top" justify="space-between">
                <Col span={4}>
                  <Row gutter={3}>
                    <Col span={4}> <Logo/> </Col>
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

            {/* styledButton={(onClick) => <ButtonAddPipeline onClick={onClick}> + Pipeline </ButtonAddPipeline>} */}

            <HLayout  hasSider={true}>
              <HSider trigger={null} collapsible={false} collapsed={false}>
                <HMenu mode="inline" onSelect={(i) => {menuSelection(i, props)}} defaultSelectedKeys={['1']}>
                  <HMenu.Item key="1"> <span className="nav-text">Jobs</span> </HMenu.Item>
                  <HMenu.Item key="2"> <span className="nav-text">Stored Pipelines</span> </HMenu.Item>
                  <HMenu.Item key="3"> <span className="nav-text">Workers</span> </HMenu.Item>
                  <HMenu.Item key="4"> <span className="nav-text">Drivers</span> </HMenu.Item>
                  <HMenu.Item key="5"> <span className="nav-text">Algorithms</span> </HMenu.Item>
                  <HMenu.Item key="6"> <span className="nav-text">Debug</span> </HMenu.Item>
                  <span className="ant-divider" />
                </HMenu>
              </HSider>
              <HContent> <BackTop/> {selectTable(props)} </HContent>
            </HLayout>
          </HLayout>
        );
    }
}

const mapStateToProps = (state) => ({
    scriptsPath: state.serverSelection.currentSelection.scriptsPath
});

LayoutInner.propTypes = {
  init: PropTypes.func.isRequired,
};

export default compose(connect(mapStateToProps,{init, addPipe}),
    withState('isTableVisible', 'onMenuSelected', {visible: true, menuItem: {}}),
    withState('isVodUpVisible', 'onVodUpPopoverClickVisible', false),
    withState('isVodDownVisible', 'onVodDownPopoverClickVisible', false)
)(LayoutInner);
