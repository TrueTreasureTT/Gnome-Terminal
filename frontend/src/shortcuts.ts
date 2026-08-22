export const shortcuts = {
  newTab: (event: KeyboardEvent) => event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 't',
  closeTab: (event: KeyboardEvent) => event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'w',
  copy: (event: KeyboardEvent) => event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'c',
  paste: (event: KeyboardEvent) => event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'v',
  search: (event: KeyboardEvent) => event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f',
  zoomIn: (event: KeyboardEvent) => event.ctrlKey && (event.key === '+' || event.key === '='),
  zoomOut: (event: KeyboardEvent) => event.ctrlKey && event.key === '-',
  resetZoom: (event: KeyboardEvent) => event.ctrlKey && event.key === '0',
}
