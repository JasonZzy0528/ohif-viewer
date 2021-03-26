const commandsModule = ({ commandsManager }) => {
  const definitions = {
    setWindowLevelFromPreset: {
      commandFn: ({ evt }) => {
        const { viewports, window, level } = evt;
        if (window && level) {
          commandsManager.runCommand('setWindowLevel', {
            viewports,
            window,
            level,
          });
        }
      },
    },
  };

  return {
    definitions,
    defaultContext: 'ACTIVE_VIEWPORT::CORNERSTONE',
  };
};

export default commandsModule;
