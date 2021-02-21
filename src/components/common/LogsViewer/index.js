/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Ansi from 'ansi-to-react';
import { Empty, Icon } from 'antd';
import Moment from 'react-moment';
import styled from 'styled-components';
import { COLOR } from 'styles/colors';
import { notification } from 'utils';
import './logColors.css';

const ContainerBase = styled.div`
  padding: 0.5em 1ch;
  white-space: pre-line;
`;

const ValidContainer = styled(ContainerBase)`
  background-color: black;
  color: white;
`;

const InvalidContainer = styled(ContainerBase)`
  background-color: transparent;
  color: black;
`;

const Message = styled.span`
  margin: 0 1em;
  flex: 1;
  &::first-letter {
    text-transform: uppercase;
  }
`;

const LineNumber = styled.span`
  display: inline-block;
  color: gray;
  min-width: 3ch;
`;

const Timestamp = styled(Moment)`
  margin: 0 1ch;
  margin-left: 2ch;
  color: ${COLOR.grey};
`;

const Tag = styled.div`
  background-color: #373737;
  border-radius: 4px;
  padding: 0.25em 1ch;
`;

const LogLine = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25em 1ch;
  :hover {
    background: #ffffff33;
  }
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  margin-right: 1ch;
  color: white;
  cursor: pointer;
  border: none;
`;

const timeFormat = 'DD/MM/YY HH:mm:ss';

class Entry extends React.PureComponent {
  onCopy = () => {
    const { timestamp, message, level } = this.props;
    window.navigator.clipboard.writeText(
      `${moment.unix(timestamp).format(timeFormat)} ${message} Level:${level}`
    );
    notification({
      message: 'Log Line Copied to clipboard',
      type: notification.TYPES.SUCCESS,
    });
  };

  render() {
    const { timestamp, message, level, idx } = this.props;
    return (
      <LogLine>
        <LineNumber>{idx + 1}</LineNumber>
        <Timestamp format={timeFormat}>{timestamp}</Timestamp>
        <Message>{message}</Message>
        <CopyButton onClick={this.onCopy} type="button">
          <Icon type="copy" />
        </CopyButton>
        <Tag data-log-level={level}>{level}</Tag>
      </LogLine>
    );
  }
}

Entry.propTypes = {
  timestamp: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
};

class BuildEntry extends React.PureComponent {
  onCopy = () => {
    const { log } = this.props;
    window.navigator.clipboard.writeText(log);
    notification({
      message: 'Log Line Copied to clipboard',
      type: notification.TYPES.SUCCESS,
    });
  };

  render() {
    const { index, log } = this.props;
    return (
      <LogLine>
        <LineNumber>{index + 1}</LineNumber>
        <Message>
          <Ansi>{log}</Ansi>
        </Message>
      </LogLine>
    );
  }
}
BuildEntry.propTypes = {
  index: PropTypes.number.isRequired,
  log: PropTypes.string.isRequired,
};

const LogsViewer = ({ dataSource, isBuild }) => {
  const [first] = dataSource;
  const isValid = isBuild || (first && first.level);
  return isValid ? (
    <ValidContainer>
      {isBuild
        ? dataSource.split('\n').map((log, ii) => (
            // eslint-disable-next-line
            <BuildEntry key={`build-log-${ii}`} log={log} idx={ii} />
          ))
        : dataSource.map((log, ii) => (
            // eslint-disable-next-line
            <Entry key={`log-line-${log.timestamp}-${ii}`} {...log} idx={ii} />
          ))}
    </ValidContainer>
  ) : (
    <InvalidContainer>
      <Empty
        description="No valid logs for current pod"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </InvalidContainer>
  );
};

LogsViewer.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  isBuild: PropTypes.bool,
};
LogsViewer.defaultProps = {
  isBuild: false,
};

export default LogsViewer;
