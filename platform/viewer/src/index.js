/**
 * Entry point for development and production PWA builds.
 * Packaged (NPM) builds go through `index-umd.js`
 */

import 'regenerator-runtime/runtime';

import App from './App.js';
import React from 'react';
import ReactDOM from 'react-dom';
// test

/**
 * EXTENSIONS
 * =================
 *
 * Importing and modifying the extensions our app uses HERE allows us to leverage
 * tree shaking and a few other niceties. However, by including them here they become
 * "baked in" to the published application.
 *
 * Depending on your use case/needs, you may want to consider not adding any extensions
 * by default HERE, and instead provide them via the extensions configuration key or
 * by using the exported `App` component, and passing in your extensions as props using
 * the defaultExtensions property.
 */
import OHIFVTKExtension from '@ohif/extension-vtk';
import OHIFDicomHtmlExtension from '@ohif/extension-dicom-html';
import OHIFDicomSegmentationExtension from '@ohif/extension-dicom-segmentation';
import OHIFDicomRtExtension from '@ohif/extension-dicom-rt';
import OHIFDicomMicroscopyExtension from '@ohif/extension-dicom-microscopy';
import OHIFDicomPDFExtension from '@ohif/extension-dicom-pdf';
import OHIFViewportOverlayExtension from '../../../extensions/dicom-viewport-overlay'
//import OHIFDicomTagBrowserExtension from '@ohif/extension-dicom-tag-browser';
// Add this for Debugging purposes:
//import OHIFDebuggingExtension from '@ohif/extension-debugging';
import { version } from '../package.json';
const CONSTANTS = {
  VIEWER_CONFIG: 'VIEWER_CONFIG',
  READY_TO_COMMUNICATE: 'READY_TO_COMMUNICATE'
}
/*
 * Default Settings
 */
let config = {};

if (window && window.parent) {
  // config = window.config || {};

  window.version = version;

  // pass config through cross document messaging
  window.addEventListener('message', event => {
    if (event.origin !== window.location.origin) {
      return
    }
    // render app when config is ready
    if (event.data && (event.data.type === CONSTANTS.VIEWER_CONFIG)) {
      config = event.data.config

      const appProps = {
        config,
        defaultExtensions: [
          OHIFVTKExtension,
          OHIFDicomHtmlExtension,
          OHIFDicomMicroscopyExtension,
          OHIFDicomPDFExtension,
          OHIFDicomSegmentationExtension,
          OHIFDicomRtExtension,
          OHIFViewportOverlayExtension
          //OHIFDebuggingExtension,
          //OHIFDicomTagBrowserExtension,
        ],
      };

      /** Create App */
      const app = React.createElement(App, appProps, null);

      /** Render */
      ReactDOM.render(app, document.getElementById('root'));
    }
    return
  })

  window.parent.postMessage({ type: CONSTANTS.READY_TO_COMMUNICATE })
}
