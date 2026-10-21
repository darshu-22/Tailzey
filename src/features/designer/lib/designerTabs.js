/** The designer's option tabs and which server field errors belong to each. */
export const DESIGNER_TABS = [
  { id: 'garment', label: 'Garment', fields: ['garmentId', 'colorId'] },
  { id: 'style', label: 'Style & fit', fields: ['styleId', 'fitId'] },
  { id: 'details', label: 'Details', prefix: 'customOptions.' },
];

const belongsTo = (tab, key) => tab.fields?.includes(key) || (tab.prefix && key.startsWith(tab.prefix));

/** Ids of the tabs holding at least one field error, in tab order. */
export function tabsWithErrors(fieldErrors = {}) {
  const keys = Object.keys(fieldErrors);
  return DESIGNER_TABS.filter((tab) => keys.some((key) => belongsTo(tab, key))).map((tab) => tab.id);
}
