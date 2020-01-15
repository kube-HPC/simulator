import { LEFT_SIDEBAR_NAMES } from 'const';
import { useActions, useDrawerEditor } from 'hooks';
import { useSelector } from 'react-redux';
import { stringify } from 'utils';
import { tableFilterSelector } from 'utils/tableSelector';

const dataSelector = tableFilterSelector(LEFT_SIDEBAR_NAMES.PIPELINES);

const usePipeline = () => {
  const dataSource = useSelector(dataSelector);

  const { deleteStored, updateStored, execStored } = useActions();

  const { open: execute } = useDrawerEditor({ onSubmit: execStored });
  const { open: update } = useDrawerEditor({ onSubmit: updateStored });

  return {
    dataSource,
    dataStats: dataSource.dataStats,
    remove: deleteStored,
    update: pipeline => update(stringify(pipeline)),
    execute: pipeline => execute(stringify(pipeline)),
  };
};

export default usePipeline;
