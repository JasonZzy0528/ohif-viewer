import './Range.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Range extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value || 0 };
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
    if (this.props.onChange) this.props.onChange(event);
  };

  componentDidUpdate(prevProps) {
    const _self = this;
    if (prevProps.value !== _self.props.value) {
      if (_self.props.value !== _self.state.value) {
        _self.setState({ value: _self.props.value });
      }
    }
  }

  render() {
    return (
      <>
        <input
          type="range"
          value={this.state.value}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step || 1}
          onChange={this.handleChange}
          id={this.props.id}
          className="range"
        />
        {this.props.showPercentage && <span>{`${this.state.value}%`}</span>}
        {this.props.showValue && <span>{this.state.value}</span>}
      </>
    );
  }
}

Range.propTypes = {
  value: PropTypes.number,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  id: PropTypes.string,
  onChange: PropTypes.func,
  showPercentage: PropTypes.bool,
  showValue: PropTypes.bool,
};

Range.defaultProps = {
  showPercentage: false,
  showValue: false,
};

export { Range };
