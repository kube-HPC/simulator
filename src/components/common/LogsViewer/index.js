/* eslint-disable max-classes-per-file */
import React from 'react';
import { COLOR } from 'styles/colors';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import AnsiToHtml from 'ansi-to-html';
import { CopyOutlined } from '@ant-design/icons';
import { Empty, Tooltip } from 'antd';
import Moment from 'react-moment';
import styled from 'styled-components';
import { notification } from 'utils';
import {
  List as VirtualizedList,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';
import './logColors.css';

/** @typedef {import('react-virtualized').ListRowProps} ListRowProps */

const List = styled(VirtualizedList)`
  &:focus {
    outline: none;
    border: none;
  }
`;

const ContainerBase = styled.div`
  padding: 0.5em 1ch;
  white-space: pre-line;
`;

const ValidContainer = styled(ContainerBase)`
  background-color: ${props => props.theme.Styles.validContainer.background};
  border: 1px solid #858899;
  color: white;
  height: inherit;
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
  white-space: nowrap;
  align-self: flex-start;
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
 * @extends React.PureComponent<EntryProps, EntryState>
 *
 * @typedef {{
 *   log: {
 *     timestamp: number;
 *     message: string;
 *     level: string;
 *   };
 *   style: React.CSSProperties;
 *   index: number;
 * }} EntryProps
 *
 * @typedef {object} EntryState
 */

const ansiConvert = new AnsiToHtml();

class Entry extends React.PureComponent {
  onCopy = () => {
    const {
      log: { timestamp, message, level },
    } = this.props;
    window.navigator.clipboard.writeText(
      `${dayjs(+timestamp).format(timeFormat)} ${message} Level:${level}`
    );
    notification({
      message: 'Log Line Copied to clipboard',
      type: notification.TYPES.SUCCESS,
    });
  };

  render() {
    const {
      log: { timestamp, message, level },
      index,
      style,
    } = this.props;

    return (
      <LogLine style={style}>
        <LineNumber>{index + 1}</LineNumber>
        <Timestamp format={timeFormat}>{+timestamp}</Timestamp>
        <Message>{message}</Message>
        <Tooltip title="Copy log to clipboard" placement="left">
          <CopyButton onClick={this.onCopy} type="button">
            <CopyOutlined />
          </CopyButton>
        </Tooltip>
        <Tag data-log-level={level}>{level}</Tag>
      </LogLine>
    );
  }
}

Entry.propTypes = {
  log: PropTypes.shape({
    timestamp: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line
  style: PropTypes.object.isRequired,
};

const emptyRow = '-'.repeat(80);
class BuildEntry extends React.PureComponent {
  // eslint-disable-next-line react/no-unused-class-component-methods
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
        <Message>{log === '' ? emptyRow : ansiConvert.toHtml(log)}</Message>
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
 * @extends React.PureComponent<LogViewerProps, LogViewerState>
 *
 * @typedef {{
 *   dataSource: object[];
 *   isBuild: boolean;
 *   id: string;
 *   emptyDescription: string;
 * }} LogViewerProps
 *
 * @typedef {any} LogViewerState
 */
class LogsViewer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 30,
    });
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props;
    if (prevProps.id !== id) {
      this.cache.clearAll();
    }
  }

  renderRow = ({ index, parent, style, key }) => {
    const { isBuild = false, dataSource } = this.props;
    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        rowIndex={index}
        parent={parent}
        key={key}>
        {isBuild ? (
          <BuildEntry style={style} index={index} log={dataSource[index]} />
        ) : (
          <Entry style={style} index={index} log={dataSource[index]} />
        )}
      </CellMeasurer>
    );
  };

  render() {
    const { isBuild, dataSource, emptyDescription } = this.props;
    const [first] = dataSource;
    const isValid = isBuild || (first && first.level);

    return isValid ? (
      <ValidContainer>
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={element => {
                // eslint-disable-next-line react/no-unused-class-component-methods
                this._list = element;
              }}
              deferredMeasurementCache={this.cache}
              overscanRowCount={0}
              rowHeight={this.cache.rowHeight}
              width={width}
              height={height}
              rowCount={dataSource.length}
              rowRenderer={this.renderRow}
            />
          )}
        </AutoSizer>
      </ValidContainer>
    ) : (
      <InvalidContainer>
        <Empty
          description={emptyDescription || 'No valid logs for current pod'}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </InvalidContainer>
    );
  }
}

LogsViewer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  isBuild: PropTypes.bool,
  id: PropTypes.string.isRequired,
  emptyDescription: PropTypes.string.isRequired,
};

export default LogsViewer;
