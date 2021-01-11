import ToolbarButton from './toolbarComponents/ToolbarButton';

const TOOLBAR_BUTTON_TYPES = {
  COMMAND: 'command'
};

const definitions = [
  {
    id: 'OVERLAY_VISIBLE',
    CustomComponent: ToolbarButton,
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'overlayVisible',
    context: 'ACTIVE_VIEWPORT::CORNERSTONE',
  },
];

export default {
  definitions,
  defaultContext: 'ACTIVE_VIEWPORT::VIEWPORT_OVERLAY',
};
