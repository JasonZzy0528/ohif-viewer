/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Range, Checkbox, OldSelect } from '@ohif/ui';

import { KEYS, ACTIONS, EXTENSION_NAME } from '../utils/reduxConstants'
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

const ToolbarSlider = props => {
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

ToolbarSlider.propTypes = {
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

const _applySlabThickness = (
  value,
  modeChecked,
  toolbarClickCallback,
  button,
  delay
) => {
  if (!modeChecked || !toolbarClickCallback) {
    return;
  }

  const { actionButton } = button;

  const generateOperation = (operation, value) => {
    // Combine slider value into slider operation
    const generatedOperation = { ...operation };
    generatedOperation.commandOptions = {
      ...operation.commandOptions,
      slabThickness: value,
    };

    return generatedOperation;
  };
  const operation = generateOperation(actionButton, value);
  if (delay) {
    setTimeout(() => toolbarClickCallback(operation), 1000)
  } else {
    toolbarClickCallback(operation)
  }
};

const _applyModeOperation = (
  operation,
  modeChecked,
  toolbarClickCallback,
  button,
  delay
) => {
  // in case modeChecked has not being triggered by user yet
  if (typeof modeChecked !== 'boolean') {
    return;
  }

  const { deactivateButton } = button;

  const _operation = modeChecked ? operation : deactivateButton;
  if (toolbarClickCallback && _operation) {
    if (delay) {
      setTimeout(() => toolbarClickCallback(_operation), 1000)
    } else {
      toolbarClickCallback(_operation);
    }
  }
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

function SlabThicknessToolbarComponent({
  parentContext,
  toolbarClickCallback,
  button,
  activeButtons,
  isActive,
  className,
}) {
  const vtkExtensionData = useSelector(state => state.extensions[EXTENSION_NAME])
  const dispatch = useDispatch()

  const currentSelectedOption = _getInitialtSelectedOption(button, vtkExtensionData);
  const [state, setState] = useState(_getInitialState(currentSelectedOption, vtkExtensionData));
  const [isMounted, setIsMounted] = useState(false)
  const prevIsMounted = useRef(isMounted)
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
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      if (!prevIsMounted.current) {
        _applyModeOperation(
          state.operation,
          state.modeChecked,
          toolbarClickCallback,
          button,
          true
        );
      } else {
        _applyModeOperation(
          state.operation,
          state.modeChecked,
          toolbarClickCallback,
          button
        );
      }
    }
  }, [state.modeChecked, state.operation, isMounted]);

  useEffect(() => {
    if (isMounted) {
      if (!prevIsMounted.current) {
        _applySlabThickness(
          state.value,
          state.modeChecked,
          toolbarClickCallback,
          button,
          true
        );
      } else {
        _applySlabThickness(
          state.value,
          state.modeChecked,
          toolbarClickCallback,
          button
        );
      }
      const value = state.value
      const id = state.operation.id
      const modeChecked = state.modeChecked
      dispatch(_setExtensionData({ id, value, modeChecked }))
    }
  }, [
    state.operation,
    state.modeChecked,
    state.value,
    isMounted
  ]);

  useEffect(() => {
    prevIsMounted.current = isMounted
  }, [isMounted])

  return (
    <div className={_className}>
      <div className="container">
        <ToolbarSlider
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
  );
}

SlabThicknessToolbarComponent.propTypes = {
  parentContext: PropTypes.object.isRequired,
  toolbarClickCallback: PropTypes.func.isRequired,
  button: PropTypes.object.isRequired,
  activeButtons: PropTypes.array.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string,
};

export default SlabThicknessToolbarComponent;
