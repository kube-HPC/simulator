import { useCallback, useState } from 'react';
import { createStore } from 'reusable';

const useDrawer = () => {
  /* 
    there's are separate values for the selected panel and the visibility
    the reason is to keep the items on the page while the drawer is animating out
    do not use the selected panel as a visibility check!
   */
  const [{ selectedPanel, isVisible }, setSelectedPanel] = useState({
    selectedPanel: null,
    isVisible: false,
  });

  const openDrawer = useCallback(
    selection =>
      setSelectedPanel({
        selectedPanel: selection,
        isVisible: true,
      }),
    []
  );
  const closeDrawer = useCallback(
    () => setSelectedPanel(state => ({ ...state, isVisible: false })),
    [setSelectedPanel]
  );

  return { isVisible, selectedPanel, openDrawer, closeDrawer };
};

export default createStore(useDrawer);
