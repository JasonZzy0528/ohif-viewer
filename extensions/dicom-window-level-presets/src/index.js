import commandsModule from './commandsModule.js';
import toolbarModule from './toolbarModule.js';
import { version } from '../package.json';

const extension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: 'customized-window-level-presets',
  version,

  getToolbarModule() {
    return toolbarModule;
  },
  getCommandsModule({ commandsManager, servicesManager }) {
    return commandsModule({ commandsManager });
  },
};

export default extension;
