import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ToolbarButton } from '@ohif/ui';

import './ToolbarButton.styl';

const OverlayToolbarButton = props => {
  const { toolbarClickCallback, button } = props;
  const { id } = button;
  const [isVisible, setIsVisible] = useState(true);

  const onClick = useCallback(() => {
    setIsVisible(!isVisible);
    toolbarClickCallback(button, !isVisible);
  }, [isVisible, toolbarClickCallback, button]);

  return (
    <ToolbarButton
      key={id}
      label={isVisible ? 'Annotation invisible' : ' Annotation visible '}
      icon={isVisible ? 'eye-closed' : 'eye'}
      onClick={onClick}
      isActive={false}
      className={'toolbar-button custom-toolbar-button-visible'}
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
