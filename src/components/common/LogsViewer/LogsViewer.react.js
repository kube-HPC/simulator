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
import { Empty } from 'antd';

const onCopy = () =>
  notification({ message: 'Log Line Copied to clipboard', type: notification.TYPES.SUCCESS });

const Container = styled.div`
  background-color: ${({ isValid }) => (isValid ? 'black' : 'transparent')};
  padding: 10px;
  color: ${({ isValid }) => (isValid ? 'white' : 'black')};
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
  background-color: #373737;
  border-radius: 4px;
`;

const TagText = styled.span`
  color: ${({ color }) => color};
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
      <Tag>
        <TagText color={COLOR_LOGGER[log.level]}>{toUpperCaseFirstLetter(log.level)}</TagText>
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

const LogsViewer = ({ dataSource, isBuild = false }) => {
  const [first] = dataSource;
  const isValid = isBuild || (first && first.level);
  return (
    <Container isValid={isValid}>
      {isBuild ? (
        dataSource.split('\n').map(toBuildEntries)
      ) : isValid ? (
        dataSource.map(toTableEntries)
      ) : (
        <Empty description="No valid logs for current pod" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Container>
  );
};

LogsViewer.propTypes = {
  dataSource: PropTypes.array.isRequired,
  isBuild: PropTypes.bool,
};

export default LogsViewer;
