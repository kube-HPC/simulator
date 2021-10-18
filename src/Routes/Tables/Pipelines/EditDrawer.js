import React, { useMemo } from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import PropTypes from 'prop-types';
import { stringify } from 'utils';
import { DRAWER_SIZE, DRAWER_TITLES } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import MissingIdError from 'components/MissingIdError';

import usePath from './usePath';
import useActivePipeline from './useActivePipeline';
import AddPipeline from '../../SidebarRight/AddPipeline';

const EditDrawer = () => {
  const { goTo } = usePath();
  const { pipeline, pipelineId } = useActivePipeline();

  const { setOff, isOn } = useToggle(true);

  const value = useMemo(() => stringify(pipeline), [pipeline]);

  return (
    <Drawer
      getContainer={false}
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      bodyStyle={{}}
      width={DRAWER_SIZE.PIPELINE_INFO}
      title={pipeline?.name ?? pipelineId}
      asFlex>
      {pipeline ? (
        <AddPipeline getContainer={false} jsonPipeline={value} />
      ) : (
        <MissingIdError />
      )}
      <TabDrawer>
        <TabDrawerText>{DRAWER_TITLES.EDIT_PIPELINE}</TabDrawerText>
      </TabDrawer>
    </Drawer>
  );
};

EditDrawer.propTypes = {
  pipeline: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

export default React.memo(EditDrawer);
