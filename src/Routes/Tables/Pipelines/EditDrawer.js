import React, { useCallback, useMemo } from 'react';
import { TabDrawerText, TabDrawer } from 'styles';
import PropTypes from 'prop-types';
import { stringify } from 'utils';
import { DRAWER_SIZE, DRAWER_TITLES } from 'const';
import Drawer from 'components/Drawer';
import useToggle from 'hooks/useToggle';
import DrawerEditor from 'components/Drawer/DrawerEditor.react';
import MissingIdError from 'components/MissingIdError';
import { useActions } from 'hooks';
import usePath from './usePath';
import useActivePipeline from './useActivePipeline';

const EditDrawer = () => {
  const { goTo } = usePath();
  const { pipeline, pipelineId } = useActivePipeline();
  const { updateStored } = useActions();
  const { setOff, isOn } = useToggle(true);

  const onSubmitUpdate = useCallback(
    payload => updateStored(JSON.parse(payload)),
    [updateStored]
  );
  const value = useMemo(() => stringify(pipeline), [pipeline]);

  return (
    <Drawer
      isOpened={isOn}
      onClose={setOff}
      onDidClose={goTo.root}
      bodyStyle={{}}
      width={DRAWER_SIZE.PIPELINE_INFO}
      title={pipeline?.name ?? pipelineId}
      asFlex>
      {pipeline ? (
        <DrawerEditor
          value={value}
          submitText="submit"
          onSubmit={onSubmitUpdate}
        />
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
