import { Tag, Typography, Button } from 'antd';
import { Descriptions } from 'components/common';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { prop } from 'styled-tools';
import DownloadLink from 'components/DownloadLink';
// TODO: re-write this whole component

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
  const [downloadHref, setDownloadHref] = useState(null);

  const handleDownload = useCallback(
    () => setDownloadHref(`/flowInput/${jobId}?download=true`),
    [jobId, setDownloadHref]
  );
  if (isPureObject(obj)) {
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
        column={getTotalColumns({ obj, vertical })}
        vertical={vertical}
        isMargin={isMargin}>
        {
          // eslint-disable-next-line
          objToItem({ obj })
        }
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
          })
        )}
      </>
    );
  }
  return String(obj);
};

RenderItemByValueType.propTypes = {
  /* eslint-disable  */
  obj: PropTypes.object,
  vertical: PropTypes.bool,
  isMargin: PropTypes.bool,
  key: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  jobId: PropTypes.string,
  /* eslint-enable  */
};

RenderItemByValueType.defaultProps = {
  jobId: null,
};

// Item
const objToItem = ({ obj, vertical, jobId }) =>
  Object.entries(obj).map(([key, value]) => (
    <Descriptions.Item key={key} label={<Text strong>{key}</Text>}>
      {isPureObject(value) && isEmptyObject(value) ? (
        <Tag>{EMPTY}</Tag>
      ) : (
        RenderItemByValueType({ obj: value, vertical, key, jobId })
      )}
    </Descriptions.Item>
  ));

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
  /* eslint-disable  */
  obj: PropTypes.object,
  vertical: PropTypes.bool,
  jobId: PropTypes.string.isRequired,
  /* eslint-enable  */
};

export default JsonTable;
