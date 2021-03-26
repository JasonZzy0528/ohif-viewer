import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ExpandableToolMenu } from '@ohif/ui';

import './ToolbarButton.styl';

const useButtons = (
  windowLevelData,
  toolbarClickCallback,
  parentButton,
  viewports
) => {
  const [buttons, setButtons] = useState([]);
  useEffect(() => {
    if (windowLevelData) {
      const keys = Object.keys(windowLevelData);
      const buttons = [];
      keys.forEach(key => {
        const windowLevel = windowLevelData[key];
        if (windowLevel.description) {
          const { window, level } = windowLevel;
          buttons.push({
            id: `W/L: ${window}/${level}`,
            label: `W/L: ${window}/${level}`,
            icon: 'level',
            onClick: () => {
              toolbarClickCallback(parentButton, { window, level, viewports });
            },
          });
        }
      });
      setButtons(buttons);
    }
  }, [windowLevelData, toolbarClickCallback, parentButton, viewports]);
  return buttons;
};

const OverlayToolbarButton = props => {
  const { button, toolbarClickCallback } = props;
  const { id } = button;

  const windowLevelData = useSelector(
    state => state.preferences.windowLevelData
  );
  const viewports = useSelector(state => state.viewports);
  const buttons = useButtons(
    windowLevelData,
    toolbarClickCallback,
    button,
    viewports
  );
  return (
    <ExpandableToolMenu
      key={id}
      label="W/L presets"
      icon="th-list"
      buttons={buttons}
      className={'toolbar-button custom-toolbar-button-window-level'}
    />
  );
};

OverlayToolbarButton.propTypes = {
  parentContext: PropTypes.object.isRequired,
  toolbarClickCallback: PropTypes.func.isRequired,
  button: PropTypes.object.isRequired,
  activeButtons: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string,
};

export default OverlayToolbarButton;
