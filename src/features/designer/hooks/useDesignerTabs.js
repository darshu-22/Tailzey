import { useState } from 'react';
import { DESIGNER_TABS, tabsWithErrors } from '../lib/designerTabs';

/**
 * Active option tab. When a save returns new field errors, jump to the first tab that
 * holds one so the message next to its picker is visible.
 * @param {object} fieldErrors from useDesignSave() (stable identity between failures)
 */
export function useDesignerTabs(fieldErrors) {
  const [activeId, setActiveId] = useState(DESIGNER_TABS[0].id);
  const [seenErrors, setSeenErrors] = useState(fieldErrors);
  const errorTabs = tabsWithErrors(fieldErrors);

  if (fieldErrors !== seenErrors) {
    setSeenErrors(fieldErrors);
    if (errorTabs.length > 0) setActiveId(errorTabs[0]);
  }

  return { tabs: DESIGNER_TABS, activeId, setActiveId, errorTabs };
}
