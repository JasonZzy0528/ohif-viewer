import ToolbarButton from './toolbarComponents/ToolbarButton';

const TOOLBAR_BUTTON_TYPES = {
  COMMAND: 'command',
  SET_TOOL_ACTIVE: 'setToolActive',
  BUILT_IN: 'builtIn',
};

const definitions = [
  {
    id: 'WINDOW_LEVEL_PRESETS',
    CustomComponent: ToolbarButton,
    type: TOOLBAR_BUTTON_TYPES.COMMAND,
    commandName: 'setWindowLevelFromPreset',
    context: 'ACTIVE_VIEWPORT::CORNERSTONE',
  },
];

export default {
  definitions,
};
