import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Typography, Image } from 'antd';
import { Ellipsis } from 'components/common';
import { useSelector } from 'react-redux';
import { selectors } from 'reducers';
import { GRAFANA_ICON } from '../../../Routes/Base/Header/Settings/grafana-icon';
import NodeStats from './NodeStats';
import JobPriority from './JobPriority';
import JobStatus from './JobStatus';
import JobTime from './JobTime';
import JobTypes from './JobTypes';

const TextLink = styled(Typography.Text)`
  padding-left: 5px;
  border-left: 1px #dddddd solid;
  margin-left: 10px;
`;
const openUrl = url => () => window.open(url);
const Id = (jobID, pipelineName) => {
  const { grafanaUrl } =
    `${useSelector(selectors.connection)}/d/pWF8HslVk/hkube-streaming-edges?orgId=1&refresh=5s&from=now-3h&to=now&var-Pipeline_Name=${pipelineName}&var-Job_ID=${jobID}`;
  return (
    <Flex>
      <Typography.Text>{jobID}</Typography.Text>

      <TextLink
        disabled={grafanaUrl === undefined}
        onClick={grafanaUrl !== undefined ? openUrl(grafanaUrl) : null}>
        <Image
          title={
            grafanaUrl !== undefined
              ? 'Grafana Steaming Edges dashboard'
              : 'No url Grafana'
          }
          disabled={grafanaUrl === undefined}
          preview={false}
          style={
            grafanaUrl !== undefined
              ? {
                  width: '15px',
                  cursor: 'pointer',
                }
              : {
                  width: '15px',
                  filter: 'grayscale(100%)',
                }
          }
          src={GRAFANA_ICON}
        />
      </TextLink>
    </Flex>
  );
};
const Name = pipelineName => <Ellipsis text={pipelineName} />;
const StartTime = (startTime, results) => (
  <JobTime startTime={startTime} results={results} />
);
const Status = status => <JobStatus status={status} />;
const Stats = status => <NodeStats status={status} />;
const Priority = priority => <JobPriority priority={priority} />;

const Types = types => <JobTypes types={types} fullName={false} />;

const TitleFlex = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;

  height: 55px;
  border-bottom: 1px solid
    ${props => props.theme.Styles.TitleDataJob.titleBottom};
`;

const Item = styled.div`
  padding-left: 23px;
`;

const ItemRightFlex = styled.div`
  padding-left: 23px;
  margin-right: auto;
`;

const TitleDataJob = ({ job = {} }) => (
  <TitleFlex>
    <Item>
      <b> {Name(job?.pipeline?.name)} </b>
    </Item>
    <ItemRightFlex>{Id(job?.key, job?.pipeline?.name)}</ItemRightFlex>

    <Item>
      {' '}
      {(job?.results &&
        job?.pipeline?.startTime &&
        StartTime(job?.pipeline?.startTime, job?.results)) ||
        ''}
    </Item>
    <Item> {(job?.pipeline?.types && Types(job?.pipeline?.types)) || ''}</Item>
    <Item>
      {(job?.pipeline?.priority && Priority(job?.pipeline?.priority)) || ''}
    </Item>
    <Item> {(job?.status && Stats(job?.status)) || ''}</Item>
    <Item> {(job?.status && Status(job?.status)) || ''}</Item>
  </TitleFlex>
);

TitleDataJob.propTypes = {
  // eslint-disable-next-line
  job: PropTypes.object,
};

export default TitleDataJob;
