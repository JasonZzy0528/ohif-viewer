const commandsModule = () => {
  const definitions = {
    overlayVisible: {
      commandFn: ({ evt }) => {
        const isVisible = evt;
        const overlayDom = document.querySelector('.ViewportOverlay');
        if (overlayDom) {
          overlayDom.style.display = isVisible ? 'block' : 'none';
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
