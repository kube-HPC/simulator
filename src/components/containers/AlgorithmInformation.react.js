import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import PropTypes from 'prop-types';
import { sideBarOpen, sideBarClose } from "../../actions/sideBar.action";
import { getCaching } from "../../actions/caching.action";
import Logs from "../dumb/Logs.react";
import Caching from "../dumb/Caching.react"
import { getKubernetesLogsData } from "../../actions/kubernetesLog.action";
import { Tabs, Card } from 'antd';
import { connect } from 'react-redux';
class AlgorithmInformation extends Component {

  render() {

    const algorithmDetails = this.props.sideBar.data ? this.props.algorithmTable.find(a => a.key === this.props.sideBar.data.payload.algorithmName) : null;
    const { data } = this.props.sideBar;

    return (
      <Tabs defaultActiveKey="1">

        <Tabs.TabPane tab="Logs" key="1">
          <Logs log={this.props.logs.dataSource.asMutable()}
            taskDetails={data && data.payload ? data.payload.batch && data.payload.batch.length ? data.payload.batch : [{ taskId: data.payload.taskId }] : null}
            rerunLogs={(taskId=data.payload.taskId) => data && this.props.getKubernetesLogsData(taskId)} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Algorithm Details" key="2">
          <Card>
            <ReactJson src={algorithmDetails} iconStyle="square" displayDataTypes={false} displayObjectSize={false} enableClipboard={false} />
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Caching" key="3">
          <Caching runCaching={() => this.props.sideBar.data && this.props.getCaching(this.props.sideBar.data.payload.jobId, this.props.sideBar.data.payload.nodeName)} />
        </Tabs.TabPane>
      </Tabs>
    )
  }

}

AlgorithmInformation.propTypes = {
  getCaching: PropTypes.func,
  sideBar: PropTypes.object,
  logs: PropTypes.object,
  algorithmTable: PropTypes.array,
};

const mapStateToProps = (state) => ({
  logs: state.kubernetesLogs,
  sideBar: state.sideBar,
  algorithmTable: state.algorithmTable.dataSource
});

export default connect(mapStateToProps, { sideBarOpen, sideBarClose, getKubernetesLogsData, getCaching })(AlgorithmInformation);


