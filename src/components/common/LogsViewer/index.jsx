import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import AnsiToHtml from 'ansi-to-html';
import { CopyOutlined } from '@ant-design/icons';
import { Empty, Tooltip } from 'antd';
import styled from 'styled-components';
import { notification } from 'utils';
import {
  List as VirtualizedList,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';
import { COLOR } from 'styles/colors';
import './logColors.css';

const List = styled(VirtualizedList)`
  &:focus {
    outline: none;
    border: none;
  }
`;

const ContainerBase = styled.div`
  padding: 0.5em 1ch;
  white-space: pre-line;
  height: 100%;
`;

const ValidContainer = styled(ContainerBase)`
  background-color: ${props => props.theme.Styles.validContainer.background};
  border: 1px solid #858899;
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
  white-space: nowrap;
  align-self: flex-start;
`;

const Timestamp = styled.span`
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
`;

const timeFormat = 'DD/MM/YY HH:mm:ss';
const ansiConvert = new AnsiToHtml();
const emptyRow = '-'.repeat(80);

const Entry = ({ log, index, style }) => {
  const onCopy = () => {
    const { timestamp, message, level } = log;
    window.navigator.clipboard.writeText(
      `${dayjs(+timestamp).format(timeFormat)} ${message} Level:${level}`
    );
    notification({
      message: 'Log Line Copied to clipboard',
      type: notification.TYPES.SUCCESS,
    });
  };

  return (
    <LogLine style={style}>
      <LineNumber>{index + 1}</LineNumber>
      <Timestamp>{dayjs(+log.timestamp).format(timeFormat)}</Timestamp>
      <Message>{log.message}</Message>
      <Tooltip title="Copy log to clipboard" placement="left">
        <CopyButton onClick={onCopy} type="button">
          <CopyOutlined />
        </CopyButton>
      </Tooltip>
      <Tag data-log-level={log.level}>{log.level}</Tag>
    </LogLine>
  );
};

Entry.propTypes = {
  log: PropTypes.shape({
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    message: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
};

const BuildEntry = ({ log, index, style }) => {
  const onCopy = () => {
    window.navigator.clipboard.writeText(log);
    notification({
      message: 'Log Line Copied to clipboard',
      type: notification.TYPES.SUCCESS,
    });
  };

  return (
    <LogLine style={style}>
      <LineNumber>{index + 1}</LineNumber>
      <Message
        dangerouslySetInnerHTML={{
          __html: log === '' ? emptyRow : ansiConvert.toHtml(log),
        }}
      />
      <Tooltip title="Copy log to clipboard" placement="left">
        <CopyButton onClick={onCopy} type="button">
          <CopyOutlined />
        </CopyButton>
      </Tooltip>
    </LogLine>
  );
};

BuildEntry.propTypes = {
  index: PropTypes.number.isRequired,
  log: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
};

const LogsViewer = ({ dataSource, isBuild = false, id, emptyDescription }) => {
  const cache = useRef(
    new CellMeasurerCache({ fixedWidth: true, defaultHeight: 30 })
  );
  const listRef = useRef(null);

  useEffect(() => {
    cache.current.clearAll();
    const raf = requestAnimationFrame(() => {
      listRef.current?.recomputeRowHeights();
      listRef.current?.forceUpdateGrid?.();
    });
    return () => cancelAnimationFrame(raf);
  }, [dataSource, id]);

  const renderRow = useCallback(
    ({ index, key, parent, style }) => (
      <CellMeasurer
        key={key}
        cache={cache.current}
        columnIndex={0}
        rowIndex={index}
        parent={parent}>
        {({ registerChild }) => (
          <div ref={registerChild} style={style}>
            {isBuild ? (
              <BuildEntry index={index} log={dataSource[index]} style={{}} />
            ) : (
              <Entry index={index} log={dataSource[index]} style={{}} />
            )}
          </div>
        )}
      </CellMeasurer>
    ),
    [dataSource, isBuild]
  );

  const [first] = dataSource;
  const isValid = isBuild || (first && first.level);

  return isValid ? (
    <ValidContainer>
      <AutoSizer>
        {({ width, height }) => (
          <List
            ref={listRef}
            deferredMeasurementCache={cache.current}
            overscanRowCount={0}
            rowHeight={cache.current.rowHeight}
            width={width}
            height={height}
            rowCount={dataSource.length}
            rowRenderer={renderRow}
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
};

LogsViewer.propTypes = {
  dataSource: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.string])
  ).isRequired,
  isBuild: PropTypes.bool,
  id: PropTypes.string.isRequired,
  emptyDescription: PropTypes.string,
};

export default LogsViewer;
