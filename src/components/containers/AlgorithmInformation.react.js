import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { sideBarOpen, sideBarClose } from "../../actions/sideBar.action";
import { getCaching } from "../../actions/caching.action";
import Logs from "../dumb/Logs.react";
import Caching from "../dumb/Caching.react"
import { getKubernetesLogsData } from "../../actions/kubernetesLog.action";
import { Tabs, Card,Button } from 'antd';

import { connect } from 'react-redux';
class AlgorithmInformation extends Component {

  constructor() {
    super();

  }



  render() {
    
    const algorithmDetails = this.props.sideBar.data ? this.props.algorithmTable.find(a => a.key === this.props.sideBar.data.payload.algorithmName) : null;

    return (
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Logs" key="1">
          <Logs log={this.props.logs.dataSource.asMutable()} rerunLogs={()=>this.props.sideBar.data&&this.props.getKubernetesLogsData(this.props.sideBar.data.payload.taskId)} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Algorithm Details" key="2">
          <Card>
            <ReactJson src={algorithmDetails}   iconStyle="square" displayDataTypes={false} displayObjectSize={false}  enableClipboard={false}/>
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane  tab="Caching" key="3">
          <Caching runCaching={()=>this.props.sideBar.data&&this.props.getCaching(this.props.sideBar.data.payload.jobId,this.props.sideBar.data.payload.nodeName)} />
        </Tabs.TabPane>
      </Tabs>
    )
  }

}



const mapStateToProps = (state) => ({
  logs: state.kubernetesLogs,
  sideBar: state.sideBar,
  algorithmTable: state.algorithmTable.dataSource
});

export default connect(mapStateToProps, { sideBarOpen, sideBarClose, getKubernetesLogsData,getCaching })(AlgorithmInformation);


