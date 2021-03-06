import commandsModule from './commandsModule.js';
import toolbarModule from './toolbarModule.js';
import { version } from '../package.json';

const extension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: 'viewport-overlay',
  version,

  getToolbarModule() {
    return toolbarModule;
  },
  getCommandsModule() {
    return commandsModule();
  },
};

export default extension;
