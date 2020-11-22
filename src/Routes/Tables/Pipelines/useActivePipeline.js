import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { tableFilterSelector } from 'utils/tableSelector';
import { LEFT_SIDEBAR_NAMES } from 'const';
import usePath from './usePath';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

export default () => {
  const { pipelineId } = usePath();
  const dataSource = useSelector(dataSelector);

  const pipeline = useMemo(
    () => dataSource.find(item => item.name === pipelineId),
    [dataSource, pipelineId]
  );

  return { pipeline, pipelineId };
};
