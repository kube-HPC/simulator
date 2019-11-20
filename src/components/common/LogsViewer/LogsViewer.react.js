import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexBox } from 'components/common';
import { toUpperCaseFirstLetter, notification } from 'utils';
import { COLOR_LOGGER, COLOR } from 'styles/colors';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import moment from 'moment';
import Ansi from 'ansi-to-react';

const onCopy = () =>
  notification({ message: 'Log Line Copied to clipboard', type: notification.TYPES.SUCCESS });

const Container = styled.div`
  background-color: black;
  padding: 10px;
  color: white;
  white-space: pre-line;
`;

const ItemWrapper = styled.div`
  color: white;
`;

const Message = styled.span`
  margin: 0px 10px;
`;

const LineNumber = styled.span`
  display: inline-block;
  color: gray;
  min-width: 20px;
`;

const Timestamp = styled.span`
  margin: 0px 10px;
  color: ${COLOR.grey};
`;

const Tag = styled.div`
  background-color: ${({ color }) => color};
  color: black;
  border-radius: 4px;
`;

const TagText = styled.span`
  padding: 5px;
`;

const LogLine = styled(FlexBox)`
  padding: 2px 10px;
  cursor: pointer;
  :hover {
    background: #6666;
  }
`;

const timeFormat = 'DD/MM/YY HH:mm:ss';

const toTableEntries = (log, index) => (
  <CopyToClipboard
    text={`${moment.unix(log.timestamp).format(timeFormat)} ${log.message} Level:${log.level}`}
    onCopy={onCopy}>
    <LogLine>
      <ItemWrapper>
        <LineNumber>{index + 1}</LineNumber>
        <Timestamp>
          <Moment format={timeFormat}>{log.timestamp}</Moment>
        </Timestamp>
        <Message>{log.message}</Message>
      </ItemWrapper>
      <Tag color={COLOR_LOGGER[log.level]}>
        <TagText>{toUpperCaseFirstLetter(log.level)}</TagText>
      </Tag>
    </LogLine>
  </CopyToClipboard>
);

const toBuildEntries = (log, index) => (
  <CopyToClipboard text={`${log}`} onCopy={onCopy}>
    <LogLine>
      <ItemWrapper>
        <LineNumber>{index + 1}</LineNumber>
        <Message>
          <Ansi>{log}</Ansi>
        </Message>
      </ItemWrapper>
    </LogLine>
  </CopyToClipboard>
);

const LogsViewer = ({ dataSource, isBuild = false }) => (
  <Container>
    {isBuild ? dataSource.split('\n').map(toBuildEntries) : dataSource.map(toTableEntries)}
  </Container>
);

LogsViewer.propTypes = {
  dataSource: PropTypes.array.isRequired,
  isBuild: PropTypes.bool,
};

export default LogsViewer;
