import { Tag, Typography, Button } from 'antd';
import { Descriptions } from 'components/common';
import PropTypes from 'prop-types';

import React, { useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { STATE_SOURCES } from 'const';

import styled from 'styled-components';
import { prop } from 'styled-tools';

const { Text } = Typography;
const EMPTY = `Empty`;

// Helpers
const isPureObject = obj =>
  !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
const getTotalColumns = ({ obj, vertical }) =>
  vertical ? Object.keys(obj).length : 1;

const isEmptyObject = obj => Object.entries(obj).length === 0;

const Margin = styled(Descriptions)`
  margin-top: ${prop('isMargin', 'none')};
`;

// Recursion Step
const RenderItemByValueType = ({
  obj,
  vertical,
  isMargin = false,
  key,
  jobId,
}) => {
  const socketUrl = useSelector(state => state[STATE_SOURCES.SOCKET_URL]);
  const downloadLinkRef = useRef();
  const handleDownload = useCallback(
    () => downloadLinkRef.current && downloadLinkRef.current?.click(),
    [downloadLinkRef]
  );

  if (isPureObject(obj)) {
    if (key === 'flowInput' && obj.truncated) {
      return (
        <>
          <Button onClick={handleDownload}>Download</Button>
          <a
            style={{ display: 'none' }}
            ref={downloadLinkRef}
            href={`${socketUrl}/flowInput/${jobId}?download=true`}
            download>
            hidden download link
          </a>
        </>
      );
    }

    return (
      <Margin
        key={key}
        column={getTotalColumns({ obj, vertical })}
        vertical={vertical}
        isMargin={isMargin}>
        {objToItem({ obj })}
      </Margin>
    );
  }
  if (Array.isArray(obj)) {
    return (
      <>
        {obj.map((value, i) =>
          RenderItemByValueType({
            obj: value,
            vertical,
            isMargin: i !== 0 || i === obj.length - 1,
            key: i,
            jobId,
          })
        )}
      </>
    );
  }
  return String(obj);
};

RenderItemByValueType.propTypes = {
  obj: PropTypes.object,
  vertical: PropTypes.bool,
  isMargin: PropTypes.bool,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  jobId: PropTypes.string,
};

// Item
function objToItem({ obj, vertical, jobId }) {
  return Object.entries(obj).map(([key, value]) => (
    <Descriptions.Item key={key} label={<Text strong>{key}</Text>}>
      {isPureObject(value) && isEmptyObject(value) ? (
        <Tag>{EMPTY}</Tag>
      ) : (
        RenderItemByValueType({ obj: value, vertical, key, jobId })
      )}
    </Descriptions.Item>
  ));
}

// Entry
const JsonTable = ({ obj, vertical = false, jobId, ...props }) => (
  <Descriptions
    column={getTotalColumns({ obj, vertical })}
    vertical={vertical}
    {...props}>
    {objToItem({ obj, vertical, jobId })}
  </Descriptions>
);

JsonTable.propTypes = {
  obj: PropTypes.object,
  vertical: PropTypes.bool,
  jobId: PropTypes.string,
};

export default JsonTable;
