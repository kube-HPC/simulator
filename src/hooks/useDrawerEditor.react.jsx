/* import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import DrawerEditor from 'components/Drawer/DrawerEditor.react';
import { DRAWER_SIZE } from 'const';
import { useDrawer } from 'hooks';

const NOOP = () => {};

const useDrawerEditor = ({ onSubmit = NOOP, submitText }) => {
  const { drawerOpen } = useDrawer();

  const open = useCallback(
    value => {
      const body = (
        <DrawerEditor
          value={value}
          submitText={submitText}
          onSubmit={onSubmit}
        />
      );
      drawerOpen({ body, width: DRAWER_SIZE.ALGORITHM_EDIT });
    },
    [drawerOpen, onSubmit, submitText]
  );

  return { open };
};

useDrawerEditor.propTypes = {
  onSubmit: PropTypes.func,
  submitText: PropTypes.string,
};

export default useDrawerEditor;
*/
