import React from 'react';
// import { asyncComponent, retryImport } from '@ohif/ui';

import commandsModule from './commandsModule.js';
import toolbarModule from './toolbarModule.js';
import { version } from '../package.json';

const Component = React.lazy(() => {
  return import('./toolbarComponents/ToolbarButton');
});

const vtkExtension = {
  /**
   * Only required property. Should be a unique value across all extensions.
   */
  id: 'viewport-overlay',
  version,

  getToolbarModule() {
    return toolbarModule;
  },
  getCommandsModule({ commandsManager, servicesManager }) {
    const { UINotificationService } = servicesManager.services;
    return commandsModule({ commandsManager, UINotificationService });
  },
};

export default vtkExtension;

export { vtkExtension };
