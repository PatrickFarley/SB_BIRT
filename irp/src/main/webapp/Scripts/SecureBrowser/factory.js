﻿// *******************************************************************************
// Educational Online Test Delivery System
// Copyright (c) 2017 American Institutes for Research
//
// Distributed under the AIR Open Source License, Version 1.0
// See accompanying file AIR-License-1_0.txt or at
// http://www.smarterapp.org/documents/American_Institutes_for_Research_Open_Source_Software_License.pdf
// *******************************************************************************
/*
 * This is the entry point for setting up the secure browser.
 */

TDS = window.TDS || {};
TDS.SecureBrowser = TDS.SecureBrowser || {};

(function(SB) {

  var sbImpl = null;

  var browserType = certified;

  var webAudioBrowserType = certified;

  var recorderImpl = null;

  function initialize() {

    if (Util.Browser.isWebAudioApiSupported()) {
      webAudioBrowserType = webaudio;
      recorderImpl = new Recorder_WebAudioService();
    }

    if (Util.Browser.isCertified()) {
      sbImpl = new TDS.SecureBrowser.Certified();
    } else if (Util.Browser.isSecure()) {
      if (Util.Browser.isCertified()) {
        sbImpl = new TDS.SecureBrowser.Certified();
      } else if (Util.Browser.isIOS()) {
        sbImpl = new TDS.SecureBrowser.Mobile.iOS();
        browserType = mobile;
        webAudioBrowserType = mobile;
        recorderImpl = new Recorder_MobileAudioService();
      } else if (Util.Browser.isAndroid()) {
        sbImpl = new TDS.SecureBrowser.Mobile.Android();
        browserType = mobile;
        webAudioBrowserType = mobile;
        recorderImpl = new Recorder_MobileAudioService();
      } else {
        sbImpl = new TDS.SecureBrowser.Firefox();
        browserType = securebrowser;
      }
    }

    if (recorderImpl == null) {
      recorderImpl = new Recorder_CertifiedService();
    }

    // Defaulting AUTO API Check to Certified
    sbImpl = new TDS.SecureBrowser.Unified();
    browserType = certified;

    if (sbImpl != null)
      sbImpl.initialize();
  }

  // expose init
  SB.initialize = initialize;

  // get the secure browser core implementation api (returns base if none
  // exist)
  SB.getImplementation = function() {
    return sbImpl;
  };

  SB.getBrowserType = function() {
    return browserType;
  };

  SB.getWebAudioBrowserType = function() {
    return webAudioBrowserType;
  };

  SB.getRecorderImplementation = function() {
    return recorderImpl;
  };

})(TDS.SecureBrowser);
