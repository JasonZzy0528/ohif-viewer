import './ViewerMain.css';

import { Component } from 'react';
import { ConnectedViewportGrid } from './../components/ViewportGrid/index.js';
import PropTypes from 'prop-types';
import React from 'react';
import memoize from 'lodash/memoize';
import _values from 'lodash/values';
import cornerstone from 'cornerstone-core';

import { commandsManager } from '../App';

var values = memoize(_values);

class ViewerMain extends Component {
  static propTypes = {
    activeViewportIndex: PropTypes.number.isRequired,
    studies: PropTypes.array,
    viewportSpecificData: PropTypes.object.isRequired,
    layout: PropTypes.object.isRequired,
    setViewportSpecificData: PropTypes.func.isRequired,
    clearViewportSpecificData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      displaySets: [],
      enabledElement: null,
    };

    this.listenOnEnabledElement = this.listenOnEnabledElement.bind(this);
    this.listenOnRendered = this.listenOnRendered.bind(this);
  }

  getDisplaySets(studies) {
    const displaySets = [];
    studies.forEach(study => {
      study.displaySets.forEach(dSet => {
        if (!dSet.plugin) {
          dSet.plugin = 'cornerstone';
        }
        displaySets.push(dSet);
      });
    });

    return displaySets;
  }

  findDisplaySet(studies, StudyInstanceUID, displaySetInstanceUID) {
    const study = studies.find(study => {
      return study.StudyInstanceUID === StudyInstanceUID;
    });

    if (!study) {
      return;
    }

    return study.displaySets.find(displaySet => {
      return displaySet.displaySetInstanceUID === displaySetInstanceUID;
    });
  }

  componentDidMount() {
    // Add beforeUnload event handler to check for unsaved changes
    //window.addEventListener('beforeunload', unloadHandlers.beforeUnload);

    // Get all the display sets for the viewer studies
    if (this.props.studies) {
      const displaySets = this.getDisplaySets(this.props.studies);
      this.setState({ displaySets }, this.fillEmptyViewportPanes);
    }
  }

  componentDidUpdate(prevProps) {
    const _self = this;
    const prevViewportAmount = prevProps.layout.viewports.length;
    const viewportAmount = this.props.layout.viewports.length;
    const isVtk = this.props.layout.viewports.some(vp => !!vp.vtk);

    try {
      const prevViewportIndex = prevProps.activeViewportIndex;
      const currentViewportIndex = _self.props.activeViewportIndex;
      const prevSeriesInstanceUID =
        prevProps.viewports.viewportSpecificData[prevViewportIndex] &&
        prevProps.viewports.viewportSpecificData[prevViewportIndex]
          .SeriesInstanceUID;
      const currentSeriesInstanceUID =
        _self.props.viewports.viewportSpecificData[currentViewportIndex] &&
        _self.props.viewports.viewportSpecificData[currentViewportIndex]
          .SeriesInstanceUID;
      if (
        this.props.studies !== prevProps.studies ||
        (viewportAmount !== prevViewportAmount && !isVtk)
      ) {
        const displaySets = this.getDisplaySets(this.props.studies);
        this.setState({ displaySets }, this.fillEmptyViewportPanes);
      }
      if (
        currentSeriesInstanceUID &&
        prevSeriesInstanceUID !== currentSeriesInstanceUID &&
        _self.props.viewports.viewportSpecificData[currentViewportIndex]
          .Modality === 'CT'
      ) {
        // https://github.com/cornerstonejs/cornerstone/issues/328
        if (!_self.state.enabledElement) {
          cornerstone.events.addEventListener(
            'cornerstoneelementenabled',
            _self.listenOnEnabledElement
          );
        } else {
          _self.listenOnEnabledElement();
        }
      }
    } catch (err) {
      console.log(err);
      // pass
    }
  }

  listenOnRendered(evt) {
    const _self = this;
    const element = evt.detail.element;
    element.removeEventListener(
      'cornerstoneimagerendered',
      _self.listenOnRendered
    );
    commandsManager.runCommand('setWindowLevel', {
      viewports: _self.props.viewports,
      window: 35,
      level: 70,
    });
  }

  listenOnEnabledElement(evt) {
    const _self = this;
    const enabledElement = evt
      ? evt.detail.element
      : _self.state.enabledElement;
    if (enabledElement !== _self.state.enabledElement) {
      _self.setState({ enabledElement });
    }
    enabledElement.removeEventListener(
      'cornerstoneimagerendered',
      _self.listenOnRendered
    );
    enabledElement.addEventListener(
      'cornerstoneimagerendered',
      _self.listenOnRendered
    );
  }

  fillEmptyViewportPanes = () => {
    // TODO: Here is the entry point for filling viewports on load.
    const dirtyViewportPanes = [];
    const { layout, viewportSpecificData } = this.props;
    const { displaySets } = this.state;

    if (!displaySets || !displaySets.length) {
      return;
    }

    for (let i = 0; i < layout.viewports.length; i++) {
      const viewportPane = viewportSpecificData[i];
      const isNonEmptyViewport =
        viewportPane &&
        viewportPane.StudyInstanceUID &&
        viewportPane.displaySetInstanceUID;

      if (isNonEmptyViewport) {
        dirtyViewportPanes.push({
          StudyInstanceUID: viewportPane.StudyInstanceUID,
          displaySetInstanceUID: viewportPane.displaySetInstanceUID,
        });

        continue;
      }

      const foundDisplaySet =
        displaySets.find(
          ds =>
            !dirtyViewportPanes.some(
              v => v.displaySetInstanceUID === ds.displaySetInstanceUID
            )
        ) || displaySets[displaySets.length - 1];

      dirtyViewportPanes.push(foundDisplaySet);
    }

    dirtyViewportPanes.forEach((vp, i) => {
      if (vp && vp.StudyInstanceUID) {
        this.setViewportData({
          viewportIndex: i,
          StudyInstanceUID: vp.StudyInstanceUID,
          displaySetInstanceUID: vp.displaySetInstanceUID,
        });
      }
    });
  };

  setViewportData = ({
    viewportIndex,
    StudyInstanceUID,
    displaySetInstanceUID,
  }) => {
    let displaySet = this.findDisplaySet(
      this.props.studies,
      StudyInstanceUID,
      displaySetInstanceUID
    );

    if (displaySet.isDerived) {
      const { Modality } = displaySet;
      displaySet = displaySet.getSourceDisplaySet(this.props.studies);

      if (!displaySet) {
        throw new Error(
          `Referenced series for ${Modality} dataset not present.`
        );
      }
    }

    this.props.setViewportSpecificData(viewportIndex, displaySet);
  };

  render() {
    const { viewportSpecificData } = this.props;
    const viewportData = values(viewportSpecificData);

    return (
      <div className="ViewerMain">
        {this.state.displaySets.length && (
          <ConnectedViewportGrid
            isStudyLoaded={this.props.isStudyLoaded}
            studies={this.props.studies}
            viewportData={viewportData}
            setViewportData={this.setViewportData}
          >
            {/* Children to add to each viewport that support children */}
          </ConnectedViewportGrid>
        )}
      </div>
    );
  }

  componentWillUnmount() {
    // Clear the entire viewport specific data
    const { viewportSpecificData } = this.props;
    Object.keys(viewportSpecificData).forEach(viewportIndex => {
      this.props.clearViewportSpecificData(viewportIndex);
    });

    // TODO: These don't have to be viewer specific?
    // Could qualify for other routes?
    // hotkeys.destroy();

    // Remove beforeUnload event handler...
    //window.removeEventListener('beforeunload', unloadHandlers.beforeUnload);
    // Destroy the synchronizer used to update reference lines
    //OHIF.viewer.updateImageSynchronizer.destroy();
    // TODO: Instruct all plugins to clean up themselves
    //
    // Clear references to all stacks in the StackManager
    //StackManager.clearStacks();
    // @TypeSafeStudies
    // Clears OHIF.viewer.Studies collection
    //OHIF.viewer.Studies.removeAll();
    // @TypeSafeStudies
    // Clears OHIF.viewer.StudyMetadataList collection
    //OHIF.viewer.StudyMetadataList.removeAll();
  }
}

export default ViewerMain;
