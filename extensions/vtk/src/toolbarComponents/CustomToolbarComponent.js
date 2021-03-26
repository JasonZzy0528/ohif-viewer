/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Range, Checkbox, OldSelect } from '@ohif/ui';

import { KEYS, ACTIONS, EXTENSION_NAME } from '../utils/reduxConstants'
import { _isDisplaySetReconstructable } from './VTKMPRToolbarButton'
import './slab-thickness-toolbar-button.styl';

const SLIDER = {
  MIN: 0.1,
  MAX: 20,
  STEP: 0.1,
};

const ToolbarLabel = props => {
  const { label } = props;
  return <div className="toolbar-button-label">{label}</div>;
};

ToolbarLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

const ToolbarComponentSlider = props => {
  const { value, min, max } = props;

  const onChange = (evt) => {
    const value = Number(evt.target.value);
    if (value <= max && value >= min) {
      props.onChange(evt)
    }
  }
  return (
    <div className="toolbar-slider-container">
      {/* <label htmlFor="toolbar-slider">{value}mm</label> */}
      <label>
        <input
          value={value}
          min={min}
          max={max}
          step={SLIDER.STEP}
          type="number"
          onChange={onChange}
        />
        mm
      </label>

      <Range
        value={value}
        min={min}
        max={max}
        step={SLIDER.STEP}
        onChange={onChange}
        id="toolbar-slider"
      />
    </div>
  );
};

ToolbarComponentSlider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

const _getSelectOptions = button => {
  return button.operationButtons.map(button => {
    return {
      key: button.label,
      value: button.id,
    };
  });
};

const _getClassNames = (isActive, className) => {
  return classnames('toolbar-button', 'slab-thickness', className, {
    active: isActive,
  });
};

const _getInitialState = (currentSelectedOption, extensionData) => {
  if (extensionData) {
    return {
      value: extensionData[KEYS.VALUE],
      sliderMin: SLIDER.MIN,
      sliderMax: SLIDER.MAX,
      modeChecked: extensionData[KEYS.MODE_CHECKED],
      operation: currentSelectedOption,
    };
  }
  return {
    value: SLIDER.MIN,
    sliderMin: SLIDER.MIN,
    sliderMax: SLIDER.MAX,
    modeChecked: undefined,
    operation: currentSelectedOption,
  };
};

const INITIAL_OPTION_INDEX = 0;

const _getInitialtSelectedOption = (button = {}, extensionData) => {
  let index
  if (extensionData && extensionData[KEYS.OPTION_ID] !== undefined) {
    const option = button.operationButtons.find(button => button.id === extensionData[KEYS.OPTION_ID])
    if (option) {
      return option
    }
  }
  return (
    button.operationButtons && button.operationButtons[INITIAL_OPTION_INDEX]
  );
};

const _setExtensionData = ({ id, value, modeChecked }) => {
  return {
    type: ACTIONS.SET_EXTENSION_DATA,
    extension: EXTENSION_NAME,
    data: {
      [KEYS.OPTION_ID]: id,
      [KEYS.VALUE]: value,
      [KEYS.MODE_CHECKED]: modeChecked
    }
  }
}

function CustomToolbarComponent({
  parentContext,
  toolbarClickCallback,
  button,
  activeButtons,
  isActive,
  className,
}) {
  const vtkExtensionData = useSelector(state => state.extensions[EXTENSION_NAME])
  const dispatch = useDispatch()
  const { viewportSpecificData, activeViewportIndex } = useSelector(state => {
    const { viewports = {} } = state;
    const { viewportSpecificData, activeViewportIndex } = viewports;

    return {
      viewportSpecificData,
      activeViewportIndex,
    };
  });

  const isVisible = _isDisplaySetReconstructable(
    viewportSpecificData,
    activeViewportIndex
  );

  const currentSelectedOption = _getInitialtSelectedOption(button, vtkExtensionData);
  const [state, setState] = useState(_getInitialState(currentSelectedOption, vtkExtensionData));
  const { label, operationButtons } = button;
  const _className = _getClassNames(isActive, className);
  const selectOptions = _getSelectOptions(button);
  function onChangeSelect(selectedValue) {
    // find select value
    const operation = operationButtons.find(
      button => button.id === selectedValue
    );

    if (operation === state.operation) {
      return;
    }

    setState({ ...state, operation });
  }

  function onChangeCheckbox(checked) {
    setState({ ...state, modeChecked: checked });
  }

  function onChangeSlider(event) {
    const value = Number(event.target.value);

    if (value !== state.value) {
      setState({ ...state, value, modeChecked: true });
    }
  }

  useEffect(() => {
    const value = state.value
    const id = state.operation.id
    const modeChecked = state.modeChecked
    dispatch(_setExtensionData({ id, value, modeChecked }))
  }, [state.modeChecked, state.operation, state.value]);

  return (
    <React.Fragment>
      {isVisible && (
        <div className={_className}>
          <div className="container">
            <ToolbarComponentSlider
              value={state.value}
              min={state.sliderMin}
              max={state.sliderMax}
              onChange={onChangeSlider}
            />
            <ToolbarLabel key="toolbar-label" label={label} />
          </div>
          <div className="controller">
            <Checkbox
              label="mode"
              checked={state.modeChecked}
              onChange={onChangeCheckbox}
            ></Checkbox>
            <OldSelect
              key="toolbar-select"
              options={selectOptions}
              value={state.operation.id}
              onChange={onChangeSelect}
            ></OldSelect>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

CustomToolbarComponent.propTypes = {
  parentContext: PropTypes.object.isRequired,
  toolbarClickCallback: PropTypes.func.isRequired,
  button: PropTypes.object.isRequired,
  activeButtons: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string,
};

export default CustomToolbarComponent;
