/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Ansi from 'ansi-to-react';
import { Empty, Icon, Tooltip } from 'antd';
import Moment from 'react-moment';
import styled from 'styled-components';
import { COLOR } from 'styles/colors';
import { notification } from 'utils';
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';
import './logColors.css';

/** @typedef {import('react-virtualized').ListRowProps} ListRowProps */

const ContainerBase = styled.div`
  padding: 0.5em 1ch;
  white-space: pre-line;
`;

const ValidContainer = styled(ContainerBase)`
  background-color: black;
  color: white;
  height: 100%;
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

/**
 * @typedef {{
 *   timestamp: number;
 *   message: string;
 *   level: string;
 *   style: React.CSSProperties;
 *   index: number;
 * }} EntryProps
 * @typedef {object} EntryState
 * @extends React.PureComponent<EntryProps, EntryState>
 */
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
    const { timestamp, message, level, index, style } = this.props;
    return (
      <LogLine style={style}>
        <LineNumber>{index + 1}</LineNumber>
        <Timestamp format={timeFormat}>{timestamp}</Timestamp>
        <Message>{message}</Message>
        <Tooltip title="Copy log to clipboard" placement="left">
          <CopyButton onClick={this.onCopy} type="button">
            <Icon type="copy" />
          </CopyButton>
        </Tooltip>
        <Tag data-log-level={level}>{level}</Tag>
      </LogLine>
    );
  }
}

Entry.propTypes = {
  timestamp: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  /* eslint-disable */
  style: PropTypes.object.isRequired,
  /* eslint-enable */
};

const emptyRow = '-'.repeat(80);
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
    const { index, log, style } = this.props;
    return (
      <LogLine style={style}>
        <LineNumber>{index + 1}</LineNumber>
        <Message>
          <Ansi>{log === '' ? emptyRow : log}</Ansi>
        </Message>
      </LogLine>
    );
  }
}
BuildEntry.propTypes = {
  index: PropTypes.number.isRequired,
  log: PropTypes.string.isRequired,
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

/**
 * @typedef {{
 *   dataSource: object[];
 *   isBuild: boolean;
 * }} LogViewerProps
 * @typedef {any} LogViewerState
 * @extends React.PureComponent<LogViewerProps, LogViewerState>
 */
class LogsViewer extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dataSource } = this.props;
    this._cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 30,
      keyMapper: index => dataSource[index],
    });
  }

  render() {
    const { isBuild, dataSource } = this.props;
    const [first] = dataSource;
    const isValid = isBuild || (first && first.level);
    return isValid ? (
      <ValidContainer>
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={element => {
                this._list = element;
              }}
              deferredMeasurementCache={this._cache}
              overscanRowCount={0}
              rowHeight={this._cache.rowHeight}
              width={width}
              height={height}
              rowCount={dataSource.length}
              rowRenderer={({ parent, index, style, key }) => (
                <CellMeasurer
                  cache={this._cache}
                  columnIndex={0}
                  rowIndex={index}
                  parent={parent}
                  key={key}>
                  {isBuild ? (
                    <BuildEntry
                      style={style}
                      index={index}
                      log={dataSource[index]}
                      cache={this.cache}
                    />
                  ) : (
                    <Entry
                      style={style}
                      index={index}
                      {...dataSource[index]}
                      cache={this.cache}
                    />
                  )}
                </CellMeasurer>
              )}
            />
          )}
        </AutoSizer>
      </ValidContainer>
    ) : (
      <InvalidContainer>
        <Empty
          description="No valid logs for current pod"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </InvalidContainer>
    );
  }
}

LogsViewer.propTypes = {
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  isBuild: PropTypes.bool,
};
LogsViewer.defaultProps = {
  isBuild: false,
};

export default LogsViewer;
