import { Tag, Typography, Button } from 'antd';
import { Descriptions } from 'components/common';
import PropTypes from 'prop-types';
import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { prop } from 'styled-tools';
import DownloadLink from 'components/DownloadLink';

const { Text } = Typography;
const EMPTY = `Empty`;

// Helpers

const isObject = obj =>
  !Array.isArray(obj) && typeof obj === 'object' && obj !== null;

const getColumns = ({ obj, vertical }) =>
  vertical ? Object.keys(obj).length : 1;

const isEmptyObject = obj => Object.entries(obj).length === 0;

const Margin = styled(Descriptions)`
  margin-top: ${prop('hasMargin', 'none')};
`;

// Recursion Step
const ItemByValueType = ({ obj, vertical, hasMargin = false, key, jobId }) => {
  const [downloadHref, setDownloadHref] = useState(null);

  const handleDownload = useCallback(
    () => setDownloadHref(`/flowInput/${jobId}?download=true`),
    [jobId, setDownloadHref]
  );

  const columns = useMemo(() => getColumns({ obj, vertical }), [obj, vertical]);

  if (isObject(obj)) {
    if (key === 'flowInput' && obj.truncated) {
      return (
        <>
          <Button onClick={handleDownload}>Download</Button>
          <DownloadLink href={downloadHref} unset={setDownloadHref} />
        </>
      );
    }
    return (
      <Margin
        key={key}
        column={columns}
        vertical={vertical}
        hasMargin={hasMargin}>
        <Items obj={obj} />
      </Margin>
    );
  }
  return Array.isArray(obj)
    ? obj.map((value, i) => (
        // eslint-disable-next-line
        <ItemByValueType
          obj={value}
          vertical={vertical}
          hasMargin={i !== 0 || i === obj.length - 1}
          // TODO:: replace the key with actual value
          // eslint-disable-next-line
          key={`${ItemByValueType}-${i}`}
        />
      ))
    : String(obj);
};

ItemByValueType.propTypes = {
  /* eslint-disable  */
  obj: PropTypes.object,
  vertical: PropTypes.bool,
  hasMargin: PropTypes.bool,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  jobId: PropTypes.string,
  /* eslint-enable  */
};

ItemByValueType.defaultProps = {
  jobId: null,
};

// Item
const Items = ({ obj, vertical, jobId }) =>
  Object.entries(obj).map(([key, value]) => (
    <Descriptions.Item key={key} label={<Text strong>{key}</Text>}>
      {isObject(value) && isEmptyObject(value) ? (
        <Tag>{EMPTY}</Tag>
      ) : (
        <ItemByValueType
          obj={value}
          vertical={vertical}
          key={key}
          jobId={jobId}
        />
      )}
    </Descriptions.Item>
  ));

// Entry
const JsonTable = ({ obj, vertical = false, jobId, ...props }) => {
  const columns = useMemo(() => getColumns({ obj, vertical }), [obj, vertical]);

  return (
    <Descriptions column={columns} vertical={vertical} {...props}>
      <Items obj={obj} vertical={vertical} jobId={jobId} />
    </Descriptions>
  );
};
JsonTable.propTypes = {
  /* eslint-disable  */
  obj: PropTypes.object,
  vertical: PropTypes.bool,
  jobId: PropTypes.string.isRequired,
  /* eslint-enable  */
};

export default JsonTable;
