/**
 * Javascript file to test TTS Manual Check for respective API, all the test are
 * given a constant number starting 1 for Play and so on.
 * 
 * 
 */

/* Constant for each test is defined in tts.js under TTS.Test */
var ttsSettingArray = Object.keys(TTS.Test);

// Initial currentTestSetting set to UNKNOWN as no test started
var currentTestSetting = "UNKNOWN";

var capabilityTestArray = Object.keys(IRT.CapabilityTest);

var processTestArray = Object.keys(IRT.ProcessTest);

var recorderTestArray = Object.keys(IRT.RecorderTest);

var propertyArray = Object.keys(IRT.CAPABILITY_PROPERTY);
/*
 * Initial value for currentTestIndex set as 0 so as to load first test (Play)
 * index from ttsSettingArray
 */
var currentTestIndex = 0;

var ttsOptionsEnabled = false;

var selectedCapability = {};

var recorderPlayDone = false;

function loadDialogBox(id, testName, testTitle, isNew) {

  var buttonDisable = false;
  var buttonText = "Skip Test";
  var isManualTestSupported = false;
  var dialogWidth = '90%';
  var dialogHeight = 800;

  if (testName == 'RECORDER') {

    if (recorderImpl != null && recorderImpl.isSupported()) {
      isManualTestSupported = true;
    }

  } else if (testName == 'TTS') {
    if (ttsImpl != null) {
      isManualTestSupported = true;
    }
  } else if (testName == 'CAPABILITY') {
    if (impl != null) {
      if (impl.capabilityManualTestSupported()) {
        dialogWidth = '70%';
        dialogHeight = 600;
        isManualTestSupported = true;

      }
    } else {
      dialogWidth = '70%';
      dialogHeight = 600;
      isManualTestSupported = false;

    }
  } else if (testName == 'PROCESS') {
    if (impl != null) {
      if (impl != null && impl.examineProcessManualTestSupported()) {
        isManualTestSupported = true;
      }
    } else {
      isManualTestSupported = false;

    }
  }

  var extTestIframeId = null;
  var extTestDivId = null;
  var extTest = false;

  if (testName == 'HTML5') {

    extTestIframeId = 'irpHTML5Test';
    extTestDivId = 'externalHTML5Test';
    extTest = true;
  }

  if (testName == 'CSS3') {
    extTestIframeId = 'irpCSS3Test';
    extTestDivId = 'externalCSS3Test';
    extTest = true;
  }

  if (extTest) {
    var iframe = $('<iframe id="'
        + extTestIframeId
        + '" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>');

    isManualTestSupported = true;

    id = $("<div id='" + extTestDivId + "'></div>").append(iframe).appendTo(
        "body");

    buttonText = 'Running...';
    buttonDisable = true;
  }

  if (!isManualTestSupported) {
    var textMessage = eval(irtApiSpecConstant + specSeparator + specMessage
        + specSeparator + "errorDialog_" + testName);

    if (testName == 'RECORDER') {
      id.html('<p><span class="irt-optional-failure-ui-icon"></span>'
          + textMessage + '</p>');
    } else {
      id.html('<p><span class="irt-failure-ui-icon"></span>' + textMessage
          + '</p>');
    }
  }

  if (isManualTestSupported) {
    id.dialog({
      autoOpen : false,
      width : dialogWidth,
      height : dialogHeight,
      title : testTitle,
      position : {
        my : "center",
        at : "center",
        of : window
      },
      close : function(event, ui) {
        currentTestSetting = 'UNKNOWN';
        currentTestIndex = 0;
        if (testName != 'HTML5' && testName != 'CSS3') {
          id.dialog("destroy");
        }
      },
      create : function(event, ui) {
        if (testName == 'TTS') {
          ttsComponentInitialize();
        }
        if (testName == 'CAPABILITY') {
          capabilityComponentInitialize();
        }
        if (testName == 'PROCESS') {

          processComponentInitialize();
        }
        if (testName == 'RECORDER') {
          recorderComponentInitialize();
        }
      },
      buttons : [ {
        id : "dialogButton",
        disabled : buttonDisable,
        text : buttonText,
        click : function() {
          if (testName == 'TTS') {
            populateManualResultIntoResultGrid(testName, $("#jsTTSGrid"),
                $("#ttsManualTest"), id);
          }
          if (testName == 'HTML5') {
            populateReportGridForExternalTest($("#jsHTML5TestGrid"),
                $("#html5TestHeader"), $("#html5ManualTest"), testName, id);

          }
          if (testName == 'CSS3') {
            populateReportGridForExternalTest($("#jsCSS3TestGrid"),
                $("#css3TestHeader"), $("#css3ManualTest"), testName, id);

          }
          if (testName == 'CAPABILITY') {
            populateManualResultIntoResultGrid(testName, $("#jsGrid"),
                $("#capabilityApiManualTest"), id);
          }
          if (testName == 'PROCESS') {
            populateManualResultIntoResultGrid(testName, $("#jsGrid"),
                $("#processApiManualTest"), id);
          }
          if (testName == 'RECORDER') {
            populateManualResultIntoResultGrid(testName,
                $("#jsAudioRecorderGrid"), $("#recorderManualTest"), id);
          }
        }
      } ]
    });
  } else {
    id.dialog({
      resizable : false,
      height : "auto",
      title : testTitle,
      width : 400,
      modal : true,
      buttons : [ {
        text : "OK",
        click : function() {
          if (testName == 'TTS') {
            populateManualResultIntoResultGrid(testName, $("#jsTTSGrid"),
                $("#ttsManualTest"), id);
          } else if (testName == 'CAPABILITY') {
            populateManualResultIntoResultGrid(testName, $("#jsGrid"),
                $("#capabilityApiManualTest"), id);
          }
          if (testName == 'PROCESS') {
            populateManualResultIntoResultGrid(testName, $("#jsGrid"),
                $("#processApiManualTest"), id);
          }
          if (testName == 'RECORDER') {
            populateManualResultIntoResultGrid(testName,
                $("#jsAudioRecorderGrid"), $("#recorderManualTest"), id);
          }
        }
      } ]
    });

  }

  if (testName == 'RECORDER') {
    if (isManualTestSupported) {
      id.dialog("open");
    } else {
      id.dialog("open");

      Util.Validation
          .setIRTTestResults(
              'FAILED',
              null,
              false,
              'Error: Could not initialize Audio Recorder Support for this browser',
              recordermanual_section);

    }
  }

  if (testName == 'TTS') {
    if (isManualTestSupported) {
      id.dialog("open");
    } else {
      id.dialog("open");

      Util.Validation.setIRTTestResults('FAILED', null, false,
          'Error: Could not initialize TTS Support for this browser',
          ttsmanual_section);

    }
  }

  if (testName == 'HTML5') {
    if (isManualTestSupported) {

      iframe.attr({
        src : '../html5test/html5test.html',
        width : '100%',
        height : '100%'
      });

      id.dialog("open");

    }
  }

  if (testName == 'CSS3') {
    if (isManualTestSupported) {

      iframe.attr({
        src : '../css3test/css3test.html',
        width : '100%',
        height : '100%'
      });

      id.dialog("open");

    }
  }

  if (testName == 'CAPABILITY') {
    if (isManualTestSupported) {
      id.dialog("open");
      if (impl != null) {
        $('#mockupnote').hide();
      }
    } else {
      id.dialog("open");

      Util.Validation
          .setIRTTestResults(
              'FAILED',
              null,
              false,
              'Error: Could not initialize Get/Set Capability Support for this browser',
              capability_section);

    }
  }

  if (testName == 'PROCESS') {
    if (isManualTestSupported) {
      id.dialog("open");
      if (impl != null) {
        $('#mockupnote').hide();
      }
    } else {
      id.dialog("open");

      Util.Validation
          .setIRTTestResults(
              'FAILED',
              null,
              false,
              'Error: Could not initialize Examine Process List Support for this browser',
              process_section);

    }
  }

  if (testName == 'HTML5' || testName == 'CSS3') {
    var saveButtonVar = setInterval(function() {
      var iframeObj = null;
      var isTestCompleted = false;
      if (testName == 'HTML5') {
        iframeObj = document.getElementById('irpHTML5Test');
      } else if (testName == 'CSS3') {
        iframeObj = document.getElementById('irpCSS3Test');
      }
      var buttons = id.dialog("option", "buttons");
      if (iframeObj.contentWindow.isTestCompleted) {
        buttons[0].text = 'Save Results';
        buttons[0].disabled = false;
        id.dialog("option", "buttons", buttons);
        clearInterval(saveButtonVar);
      }
    }, 1000);
  }

}

function processComponentInitialize() {
  if (currentTestSetting == IRT.ProcessTest.UNKNOWN) {

    currentTestSetting = IRT.ProcessTest.EXAMINE;

  }

  $('#multiselect').multiselect();
  populateJsonGrid($("#processTestGrid"), 'PROCESS', false);
  createButton($("#examineProcess"), 'Examine', 'Examine');
  loadAvailableForbiddenApps();
  if (Util.Validation.getProcessManualResult().length == 0) {
    populateReportGrid(processTestArray, process_section);
  }
}

function capabilityComponentInitialize() {

  if (currentTestSetting == IRT.CapabilityTest.UNKNOWN) {

    currentTestSetting = IRT.CapabilityTest.SET;

  }

  createSelectMenu($("#capabilityType"), 'CAPABILITY');
  createRadioButton($("#enableCapability"));
  createRadioButton($("#disableCapability"));
  createButton($("#setCapability"), 'Set', 'Set');
  createButton($("#getCapability"), 'Get', 'Get');
  loadCapabilities();
  disableUIOptions('CAPABILITY', specCapabilityManualApi, capabilityTestArray);
  enableUIOptions('CAPABILITY', specCapabilityManualApi, capabilityTestArray);

  populateJsonGrid($("#capabilityTestGrid"), 'CAPABILITY', false);

  populateJsonGrid($("#capabilityPropertyGrid"), 'PROPERTY', true);

  if (Util.Validation.getCapabilityManualResult().length == 0) {
    populateReportGrid(capabilityTestArray, capability_section);
  }

}

function ttsComponentInitialize() {

  if (currentTestSetting == TTS.Test.UNKNOWN) {

    currentTestSetting = TTS.Test.PLAY;

  }

  createSlider($("#ttsVolume"), $("#ttsVolumeText"), 'Volume', 0, 10, 10);
  createSlider($("#ttsPitch"), $("#ttsPitchText"), 'Pitch', 0, 20, 10);
  createSlider($("#ttsRate"), $("#ttsRateText"), 'Rate', 0, 20, 10);
  createSlider($("#systemVolume"), $("#systemVolumeText"), 'System Volume', 0,
      10, 10);
  createButton($("#play"), 'Play', 'Play');
  createButton($("#pause"), 'Pause', 'Pause');
  createButton($("#resume"), 'Resume', 'Resume');
  createButton($("#stop"), 'Stop', 'Stop');
  createButton($("#systemMute"), 'Mute', 'Mute');
  createButton($("#systemUnMute"), 'Ummute', 'Ummute');
  createSelectMenu($("#voices"), 'TTS');
  loadVoices();
  disableUIOptions('TTS', specTTSManualApi, ttsSettingArray);
  enableUIOptions('TTS', specTTSManualApi, ttsSettingArray);
  populateJsonGrid($("#ttsGrid"), 'TTS', false);
  if (Util.Validation.getTTSManualResult().length == 0) {
    populateReportGrid(ttsSettingArray, ttsmanual_section);
  }
}

function populateManualResultIntoResultGrid(testName, gridId, linkId, dialogId) {

  var manualApiDetails = {};
  var irtTestSectionObj = null;
  if (testName == 'TTS') {
    manualApiDetails = Util.Validation.mergeTTSResultIntoResult();
  }
  if (testName == 'CAPABILITY') {
    manualApiDetails = Util.Validation.mergeCapabilityResultIntoResult();
  }

  if (testName == 'PROCESS') {
    manualApiDetails = Util.Validation.mergeProcessResultIntoResult();
  }

  if (testName == 'CAPABILITY' || testName == 'PROCESS') {
    Util.Validation.updateManualResultHeaderCount(manualApiDetails,
        IRT.AUTOMATED_TEST_SECTION.browserapi);
  }
  if (testName == 'TTS') {
    Util.Validation.updateManualResultHeaderCount(manualApiDetails,
        IRT.AUTOMATED_TEST_SECTION.ttsapi);
  }

  if (testName == 'RECORDER') {

    manualApiDetails = Util.Validation.mergeAudioRecorderManualTestIntoResult();
    Util.Validation.updateManualResultHeaderCount(manualApiDetails,
        IRT.AUTOMATED_TEST_SECTION.audiorecordapi);
  }

  gridId.jsGrid("refresh");

  linkId.button("disable");

  currentTestSetting = 'UNKNOWN';

  currentTestIndex = 0;

  dialogId.dialog("close");

}

function createSlider(id, textId, text, minValue, maxValue, sliderValue) {

  id.slider({
    orientation : "horizontal",
    min : minValue,
    max : maxValue,
    value : sliderValue,
    range : "min",
    animate : true,
    create : function() {
      textId.text(text + ' (' + $(this).slider("value") + ')');
      var opt = $(this).data().uiSlider.options;
      // Get the number of possible values
      var vals = opt.max - opt.min;
      if (vals != 0) {
        var elMin = $('<label>' + (opt.min) + '</label>').css('left',
            (opt.min / vals * 100) + '%');
        var elMax = $('<label>' + (opt.max) + '</label>').css('left',
            (opt.max / vals * 100) + '%');
        id.append(elMin);
        id.append(elMax);
      }
    }
  });

  id.on("slidechange", function(event, ui) {
    textId.text(text + ' (' + ui.value + ')');
    if (text == 'Volume') {
      setTTSVolume(ui.value);
    } else if (text == 'Pitch') {
      setTTSPitch(ui.value);
    } else if (text == 'Rate') {
      setTTSRate(ui.value);
    } else if (text == 'System Volume') {
      setSystemVolume(ui.value);
    }
  });

}

function createSelectMenu(id, testName) {
  id.selectmenu({
    select : function(event, ui) {
      if (testName == 'TTS') {
        setVoice();
      }
      if (testName == 'CAPABILITY') {
        setSelectedCapability(ui.item.label, ui.item.value, ui.item.index);
      }
      if (testName = 'RECORDER_INPUT') {
        // setRecorderInput(ui.item.label, ui.item.value, ui.item.index);
      }
    }
  });
}

function createRadioButton(id) {
  id.checkboxradio();
}

function createButton(id, text, displaylabel) {

  id.button({
    label : displaylabel
  });

  id.click(function(event) {

    if (text == 'Play') {
      ttsPlay();
    } else if (text == 'Pause') {
      ttsPause();
    } else if (text == 'Resume') {
      ttsResume();
    } else if (text == 'Stop') {
      ttsStop();
    } else if (text == 'Mute') {
      id.addClass("irt-custom-button-click");
      $("#play").focus();
      muteUnmuteSystem(true);
    } else if (text == 'Ummute') {
      id.addClass("irt-custom-button-click");
      $("#play").focus();
      muteUnmuteSystem(false);
    } else if (text == 'Set') {
      setSystemCapability();
    } else if (text == 'Get') {
      getSystemCapability();
    } else if (text == 'Examine') {
      examineProcessList();
    } else if (text == 'OK') {
      concludeExamineProcess();
    } else if (text == 'Done') {
      saveIRTResult();
    } else if (text == 'Initiate') {
      initiateRecorder();
    } else if (text == 'Status') {
      getRecorderStatus();
    } else if (text == 'Capabilities') {
      getDeviceCapabilities();
    } else if (text == 'Conclude Capability') {

      concludeDeviceCapabilityTest();

    } else if (text == 'Record') {
      startRecordingAudio();
    } else if (text == 'Stop Recording') {
      stopRecordingAudio();
    } else if (text == 'Play Recording') {
      startPlaybackRecording();
    } else if (text == 'Pause Playback') {
      pausePlaybackRecording();
    } else if (text == 'Resume Playback') {
      resumePlaybackRecording();
    } else if (text == 'Stop Playback') {
      stopPlaybackRecording();
    }

    event.preventDefault();
  });

}

function getContextPath() {
  return window.location.pathname.substring(0, window.location.pathname
      .indexOf("/", 2));
}

function showReportIdDialog(textInfo, reportId, success, errorMessage) {

  var id = $('#reportInfoDialog');
  var iconClass = 'irt-success-ui-icon';
  var textMessage = eval(irtApiSpecConstant + specSeparator + specMessage
      + specSeparator + "errorDialog_" + textInfo);

  $("#retry").addClass("irt-grid-column-hide");
  if (reportId == null && !success) {

    $("#retry").removeClass("irt-grid-column-hide");
    $("#home").addClass("irt-grid-column-hide");
    reportId = "";
    iconClass = 'irt-failure-ui-icon';
  }

  var reportIdLink = '';
  if (textInfo == 'saveSuccess') {
    var cntxPath = getContextPath();
    reportIdLink = "<a href='"
        + cntxPath
        + "/report/"
        + reportId
        + "' class='report-id-link' title='Click to view final report' id='reportIdLink'>"
        + reportId + "</a>";
  }
  id.html('<p><span class="' + iconClass + '"></span>' + textMessage
      + '<div class="report-id-details">' + reportIdLink + '</div>'
      + errorMessage + '</p>');

  id.dialog({
    resizable : false,
    height : "auto",
    title : 'IRT Result Info',
    width : 500,
    modal : true,
    buttons : [ {
      id : "retry",
      text : "Retry",
      click : function() {
        $(this).dialog("close");
      }
    }, {
      id : "homeButton",
      text : "Home",
      click : function() {
        $(this).dialog("close");
        window.location.href = getContextPath();
      }
    }, {
      text : "OK",
      click : function() {
        $(this).dialog("close");

      }
    } ]
  });

  if (reportId != null && success) {
    $("#retry").addClass("irt-grid-column-hide");
    $('#reportIdLink').blur();
    $('#reportIdLink').tooltip({
      position : {
        my : "left+15 center",
        at : "right center"
      }
    });
  }
  if ((reportId == null && !success) || !success) {
    $("#homeButton").addClass("irt-grid-column-hide");
  }
}

function saveIRTResult() {

  $.ajax({
    type : "POST",
    url : getContextPath() + '/report/saveReport',
    data : {
      "reportJsonData" : JSON.stringify(Util.Validation
          .formulateJsonForReport())
    },
    success : successSaveIRTResult,
    error : errorSaveIRTResult
  });

  function successSaveIRTResult(data, status) {

    if (data.success == true) {
      $("#endBrowserTest").button("disable");
      showReportIdDialog("saveSuccess", data.reportId, data.success,
          data.message);
    } else {
      showReportIdDialog("saveFailure", data.reportId, data.success,
          data.message);
    }
  }

  function errorSaveIRTResult(data) {
    showReportIdDialog("saveFailure", null, false, "");
  }

}

function examineProcessList() {

  var selectedArray = $('#multiselect_to option');
  var selectedProcess = [];
  selectedArray.each(function() {
    selectedProcess.push(this.value);
  });

  $("#runningForBiddenApps").show();
  $("#concludeButton").show();

  createButton($("#conclude"), "OK", "OK");
  var forbiddenRunningApps = impl != null ? impl
      .examineProcessList(selectedProcess) : selectedProcess;
  populateRunningForbiddenApplist(forbiddenRunningApps);

}

function concludeExamineProcess() {
  setDialogHtml(specProcessManualApi);
  loadTestDialogConfirm($("#processTestGrid"), 'PROCESS', specProcessManualApi);
}

function setSelectedCapability(label, value, index) {
  selectedCapability = {};
  $.extend(selectedCapability, {
    "label" : label,
    "value" : value,
    "index" : index
  });

}

function udpateCapabilityStatusGrid() {
  var testResult = impl != null ? impl.getCapability(selectedCapability.value)
      : false;

  var itemDetail = {};
  $.extend(itemDetail, {
    "instruction" : selectedCapability.label + " [ " + selectedCapability.value
        + " ] ",
    "testResult" : testResult.toString()
  });

  $("#capabilityPropertyGrid")
      .jsGrid(
          "updateItem",
          getTTSTestGridItem($("#capabilityPropertyGrid"),
              selectedCapability.index), itemDetail);

}

function setSystemCapability() {

  var capabilityType = $('#capabilityType').val();
  var functionality = $('input[name="getSetCapability"]:checked').val();

  if (capabilityType != null && capabilityType != undefined
      && functionality != null && functionality != undefined) {
    if (impl != null) {
      impl.setCapability(capabilityType, (functionality == 'true'));
    }
    udpateCapabilityStatusGrid();
    setDialogHtml(specCapabilityManualApi);
    loadTestDialogConfirm($('#capabilityTestGrid'), 'CAPABILITY',
        specCapabilityManualApi);
  }

}

function getSystemCapability() {

  var capabilityType = $('#capabilityType').val();

  if (capabilityType != null && capabilityType != undefined) {
    udpateCapabilityStatusGrid();
    setDialogHtml(specCapabilityManualApi);
    loadTestDialogConfirm($("#capabilityTestGrid"), 'CAPABILITY',
        specCapabilityManualApi);
  }

}

function loadAvailableForbiddenApps() {

  var selectList = document.getElementById("multiselect");

  var operatingSystem = Util.Browser.getOperatingSystem();

  var forbiddenArray = eval('IRT_FORBIDDEN.' + operatingSystem);

  forbiddenArray.forEach(function(item, index, array) {
    var opt = document.createElement("option");
    opt.value = item.processname;
    opt.text = item.processdescription;
    selectList.options.add(opt);

  });

}

function loadCapabilities() {
  var selectList = document.getElementById("capabilityType");
  propertyArray.forEach(function(item, index, array) {

    var capabilityType = eval('IRT.CAPABILITY_PROPERTY.' + item);
    var opt = document.createElement("option");
    opt.value = capabilityType;
    opt.text = item;
    selectList.options.add(opt);

  });
}

function loadVoices() {
  if (isMobile) {
    var voices = ttsImpl.getVoices();
    if (voices) {
      var selectList = document.getElementById("voices");
      var voiceArray = new Array();
      for (var i = 0; i < voices.length; i++) {
        var opt = document.createElement("option");
        var voice = voices[i];
        voiceArray[i] = voice.language + " " + (voice.voice ? voice.voice : "");
        opt.value = JSON.stringify(voice);
        opt.text = voice.language;
        selectList.options.add(opt);
      }
    } else {
      alert("cannot retrieve voice packs");
    }
  } else {
    if (!!ttsImpl.getVoices) {
      // alert(r.voices);
      var voicelist = ttsImpl.getVoices();
      var selectList = document.getElementById("voices");
      for (var i = 0; i < voicelist.length; i++) {
        var opt = document.createElement("option");
        opt.text = voicelist[i];
        opt.value = voicelist[i];
        selectList.options.add(opt);
      }
    } else {
      alert("Cannot retrieve system voice list");
    }
  }
}

function setVoice() {
  // currentTestSetting = TTS.Test.VOICE;
  ttsImpl.setVoice($("#voices").val());
}

function ttsPlay() {

  var text = $("textarea#ttsText").val();
  ttsImpl.stop();
  ttsImpl.play(text);

  if (currentTestSetting == TTS.Test.PLAY) {

    setDialogHtml(specTTSManualApi);

    loadTestDialogConfirm($("#ttsGrid"), 'TTS', specTTSManualApi);
  } else if (ttsOptionsEnabled) {
    setDialogHtml(specTTSManualApi);

    loadTestDialogConfirm($("#ttsGrid"), 'TTS', specTTSManualApi);
  }
}

function ttsPause() {

  ttsImpl.pause();

  if (currentTestSetting == TTS.Test.PAUSE) {

    setDialogHtml(specTTSManualApi);

    loadTestDialogConfirm($("#ttsGrid"), 'TTS', specTTSManualApi);
  }

}

function ttsResume() {

  // currentTestSetting = TTS.Test.RESUME;

  setDialogHtml(specTTSManualApi);

  ttsImpl.resume();

  loadTestDialogConfirm($("#ttsGrid"), 'TTS', specTTSManualApi);

}

function ttsStop() {

  // currentTestSetting = TTS.Test.STOP;

  setDialogHtml(specTTSManualApi);

  ttsImpl.stop();

  loadTestDialogConfirm($("#ttsGrid"), 'TTS', specTTSManualApi);

}

function setTTSVolume(level) {
  // currentTestSetting = TTS.Test.VOLUME;

  if (ttsImpl.supportsVolumeControl()) {
    ttsImpl.setVolume(level);
  }
}

function setTTSPitch(level) {
  // currentTestSetting = TTS.Test.PITCH;

  if (ttsImpl.supportsPitchControl()) {
    ttsImpl.setPitch(level);
  }
}

function setTTSRate(level) {
  // currentTestSetting = TTS.Test.RATE;
  if (ttsImpl.supportsRateControl()) {
    ttsImpl.setRate(level);
  }
}

function setSystemVolume(level) {
  // currentTestSetting = TTS.Test.SYSTEM_VOLUME;
  if (!!ttsImpl.setSystemVolume) {
    ttsImpl.setSystemVolume(level);
  }
}

function getTTSStatus() {
  return ttsImpl.getStatus();
}

function muteUnmuteSystem(enable) {
  if (!!ttsImpl.setsystemMute) {
    ttsImpl.setTTSsystemMute(enable);
  }
}

function setMuteUnMuteButtonText() {
  if (!!ttsImpl.getsystemMute) {
    if (ttsImpl.getsystemMute()) {
      $('button#systemMute').text('Unmute');
    } else {
      $('button#systemMute').text('Mute');
    }
  } else {
    $('button#systemMute').text('Mute/UnMute');
  }
}

function populateJsonGrid(id, testName, hideResult) {

  var gridArray = [];
  var testNameTitle = 'Test Name';
  var resultColumnCss = "";
  var valueColumnCss = "";
  if (testName == 'TTS') {
    /**
     * Loading first test to test TTS Speak.
     */
    var ttsGridArray = [];

    var playObj = eval(irtApiSpecConstant + specSeparator + specTTSManualApi
        + specSeparator + currentTestSetting);
    playObj.testResult = null;
    ttsGridArray.push(playObj);

    gridArray = ttsGridArray.slice();
  }

  if (testName == 'CAPABILITY') {

    var capabilityGridArray = [];

    var setObj = eval(irtApiSpecConstant + specSeparator
        + specCapabilityManualApi + specSeparator + currentTestSetting);
    setObj.testResult = null;
    capabilityGridArray.push(setObj);
    gridArray = capabilityGridArray.slice();

  }
  if (testName == 'PROPERTY') {
    gridArray = populatePropertyGrid().slice();
  }

  if (testName == 'PROCESS') {
    var processGridArray = [];

    var setObj = eval(irtApiSpecConstant + specSeparator + specProcessManualApi
        + specSeparator + currentTestSetting);
    setObj.testResult = null;
    processGridArray.push(setObj);
    gridArray = processGridArray.slice();
  }

  if (testName == 'RECORDER') {

    var recorderGridArray = [];

    var setObj = eval(irtApiSpecConstant + specSeparator
        + specRecorderManualApi + specSeparator + currentTestSetting);
    setObj.testResult = null;
    recorderGridArray.push(setObj);
    gridArray = recorderGridArray.slice();

  }

  if (hideResult) {
    testNameTitle = 'Capability'
    resultColumnCss = 'irt-grid-column-hide';
  } else {
    valueColumnCss = 'irt-grid-column-hide';
  }

  id
      .jsGrid({
        width : "100%",
        data : gridArray,
        selecting : false,

        fields : [
            {
              title : testNameTitle,
              name : "instruction",
              type : "text",
              width : 150
            },
            {
              title : "Result",
              name : "testResult",
              type : "text",
              width : 30,
              align : "center",
              css : resultColumnCss,
              itemTemplate : function(value, item) {

                var isRequired = true;
                if (item != null && item != undefined && item.required != null
                    && item.required != undefined && item.required.all != null
                    && item.required.all != undefined && !item.required.all) {
                  isRequired = false;
                }

                if (value == null) {
                  return "";
                } else if (isRequired === true && value === true) {
                  return '<img alt="Required test passed" title="Required test passed" src="../../../Shared/images/button-check_green.png" id="result-icon">';
                } else if (isRequired === true && value === false) {
                  return '<img alt="Required test failed" title="Required test failed" src="../../../Shared/images/button-cross_red.png" id="result-icon">';
                } else if (isRequired === false && value === true) {
                  return '<img alt="Optional test passed" title="Optional test passed" src="../../../Shared/images/button-check_yellow.png" id="result-icon">';
                } else if (isRequired === false && value === false) {
                  return '<img alt="Optional test failed" title="Optional test failed" src="../../../Shared/images/button-cross_yellow.png" id="result-icon">';
                } else {
                  return value;
                }

              }

            }, {
              title : "Status",
              name : "testResult",
              type : "text",
              width : 50,
              css : valueColumnCss
            },

        ]
      });
}

function getTTSTestGridItem(manualGridId, gridIndex) {

  return manualGridId.data("JSGrid").data[gridIndex];

}

function loadTestDialogConfirm(manualGridId, testName, currentManualApi) {

  $("#dialog-confirm").dialog(
      {
        resizable : false,
        height : "auto",
        title : eval(irtApiSpecConstant + specSeparator + currentManualApi
            + specSeparator + currentTestSetting + specSeparator
            + "dialogTitle"),
        width : 400,
        modal : true,
        buttons : [ {
          text : "Yes",
          click : function() {
            closeConfirmBox(manualGridId, testName, currentManualApi, true);
          }
        }, {
          text : "No",
          click : function() {
            closeConfirmBox(manualGridId, testName, currentManualApi, false);
          }
        }, {
          text : "Retry",
          click : function() {
            $(this).dialog("close");
          }
        } ]
      });
}

function closeConfirmBox(manualGridId, testName, currentManualApi, result) {

  $("#dialog-confirm").dialog("close");
  var manualResultArray = null;
  var testingArray = null;
  if (testName == 'TTS') {
    manualResultArray = Util.Validation.getTTSManualResult();
    testingArray = ttsSettingArray.slice();
  } else if (testName == 'CAPABILITY') {
    manualResultArray = Util.Validation.getCapabilityManualResult();
    testingArray = capabilityTestArray.slice();

  } else if (testName == 'PROCESS') {
    manualResultArray = Util.Validation.getProcessManualResult();
    testingArray = processTestArray.slice();

  } else if (testName == 'RECORDER') {
    manualResultArray = Util.Validation.getAudioTestManualArray();
    testingArray = recorderTestArray.slice();
  }

  if (currentTestSetting == testingArray[currentTestIndex]) {
    manualGridId.jsGrid("updateItem", getTTSTestGridItem(manualGridId,
        currentTestIndex), Util.Validation.setTTSItemDetail(currentTestSetting,
        currentManualApi, result));

    manualResultArray[currentTestIndex].testResult = result;
    manualResultArray[currentTestIndex].details = '';

    if (result === true) {
      manualResultArray[currentTestIndex].testPoints = eval(irtApiSpecConstant
          + specSeparator + currentManualApi + specSeparator
          + testingArray[currentTestIndex] + specSeparator + "points");

    }

    loadNextManualTest(manualGridId, testName, currentManualApi, testingArray);
  }

}

function loadNextManualTest(manualGridId, testName, currentManualApi,
    testingArray) {
  currentTestIndex = currentTestIndex + 1;
  if (currentTestIndex < testingArray.length - 1) {
    currentTestSetting = testingArray[currentTestIndex];

    manualGridId.jsGrid("insertItem", Util.Validation.setTTSItemDetail(
        currentTestSetting, currentManualApi, null));

    disableUIOptions(testName, currentManualApi, testingArray);
    enableUIOptions(testName, currentManualApi, testingArray);
  } else {
    changeDialogBoxButtonText($('#dialog' + testName), 'Done');
    disableUIOptions(testName, currentManualApi, testingArray);
  }
}

function changeDialogBoxButtonText(id, buttonText) {
  var buttons = id.dialog("option", "buttons");
  buttons[0].text = buttonText;
  id.dialog("option", "buttons", buttons);
}

function setDialogHtml(currentManualApi) {

  $("#dialog-confirm").html(
      eval(irtApiSpecConstant + specSeparator + currentManualApi
          + specSeparator + currentTestSetting + specSeparator + "dialogHtml"));

}

function disableUIOptions(testName, currentManualApi, testingArray) {

  var disableIds = null;
  disableIds = eval(irtApiSpecConstant + specSeparator + currentManualApi
      + specSeparator + currentTestSetting + specSeparator + "disableSection");

  /**
   * Disabling all option once all test are completed currently we have 11 test
   */
  if (currentTestIndex == testingArray.length - 1) {
    disableIds = eval(irtApiSpecConstant + specSeparator + specDisableUI
        + specSeparator + testName + "_disable_all");

    if (testName == 'RECORDER') {

      recorderImpl.audioRecorderClosed();
      setTimeout(function() {
        var recorderState = recorderImpl.getAudioRecorderStatus();
        $('#recorderStatusText').html(recorderState);
      }, 2000);

    }
  }

  /* var disableArray = disableIds.split(","); */

  disableIds.forEach(function(item, index, array) {

    var buttonSliderId = null;
    if (testName == 'TTS') {
      buttonSliderId = eval(irtApiSpecConstant + specSeparator
          + currentManualApi + specSeparator + item + specSeparator
          + "buttonSliderId");
    } else {
      buttonSliderId = item;
    }
    if ($('#' + buttonSliderId).is(":ui-checkboxradio")) {
      $('#' + buttonSliderId).checkboxradio("disable");
    } else if ($('#' + buttonSliderId).is(":ui-button")) {
      $('#' + buttonSliderId).button("disable");
      $("#" + buttonSliderId).removeClass("irt-custom-button-click");
    } else if ($('#' + buttonSliderId).is(":ui-slider")) {
      $('#' + buttonSliderId).slider("disable");
      $('#' + buttonSliderId).slider("option", "value", 10);
    } else {
      $('#' + buttonSliderId).selectmenu("disable");
    }

  });
}

function enableUIOptions(testName, currentManualApi, testingArray) {
  var enableIds = eval(irtApiSpecConstant + specSeparator + currentManualApi
      + specSeparator + currentTestSetting + specSeparator + "enableSection");

  /* var enableArray = enableIds.split(","); */

  enableIds.forEach(function(item, index, array) {

    var buttonSliderId = null;
    if (testName == 'TTS') {
      buttonSliderId = eval(irtApiSpecConstant + specSeparator
          + currentManualApi + specSeparator + item + specSeparator
          + "buttonSliderId");
    } else {
      buttonSliderId = item;
    }

    if ($('#' + buttonSliderId).is(":ui-checkboxradio")) {
      $('#' + buttonSliderId).checkboxradio("enable");
    } else if ($('#' + buttonSliderId).is(":ui-button")) {
      $('#' + buttonSliderId).button("enable");
    } else if ($('#' + buttonSliderId).is(":ui-slider")) {
      $('#' + buttonSliderId).slider("enable");
      ttsOptionsEnabled = true;

      /**
       * Enabling Instruction to use sliders for test where its define constant
       * is greater than 3
       */
      $("#ttsOptions").show();
    } else {
      $('#' + buttonSliderId).selectmenu("enable");
    }

  });
}

function populateReportGrid(sectionArray, section) {

  sectionArray.forEach(function(item, index, array) {
    if (item != TTS.Test.UNKNOWN) {

      Util.Validation.setIRTTestResults(item, null, null,
          'Test not performed by user', section);
    }

  });

}

function populatePropertyGrid() {

  var propertyGridArray = [];

  propertyArray.forEach(function(item, index, array) {

    var capabilityType = eval('IRT.CAPABILITY_PROPERTY.' + item);
    var testResult = impl != null ? impl.getCapability(capabilityType) : false;

    propertyGridArray.push({
      "instruction" : item + " [ " + capabilityType + " ] ",
      "testResult" : testResult.toString()
    });

  });

  return propertyGridArray;

}

function populateReportGridForExternalTest(gridId, headerId, testId, testName,
    dialogId) {
  var iframeObj = null;
  if (testName == 'HTML5') {
    iframeObj = document.getElementById('irpHTML5Test');

    if (iframeObj.contentWindow.isTestCompleted) {

      Util.Validation.setHtml5TestArray(iframeObj.contentWindow.html5TestArray);
      populateResults(gridId, Util.Validation.getHtml5TestArray(), true);

      $('#' + headerId[0].id + ' #externalTestScore').append(
          iframeObj.contentWindow.htmlScoreHTML);
    }
  }

  else if (testName == 'CSS3') {
    iframeObj = document.getElementById('irpCSS3Test');

    if (iframeObj.contentWindow.isTestCompleted) {

      Util.Validation.setCSS3TestArray(iframeObj.contentWindow.css3TestArray);
      populateResults(gridId, Util.Validation.getCSS3TestArray(), true);

      $('#' + headerId[0].id + ' #externalTestScore').append(
          iframeObj.contentWindow.css3ScoreHTML);

    }
  }

  var percent = 0;
  if ((iframeObj.contentWindow.rTestPass + iframeObj.contentWindow.rTestFail) > 0) {

    var optionalScoringFlag = $.cookie("optionalScoring");

    var totalPassedTest = 0;
    var totalTest = 0;
    if (optionalScoringFlag === 'Yes') {
      totalPassedTest = iframeObj.contentWindow.rTestPass
          + iframeObj.contentWindow.oTestPass;

      totalTest = iframeObj.contentWindow.totalTest;
    } else {
      totalPassedTest = iframeObj.contentWindow.rTestPass;
      totalTest = iframeObj.contentWindow.rTestPass
          + iframeObj.contentWindow.rTestFail;
    }

    percent = Math.round(100 * totalPassedTest / totalTest);
  }

  $('#' + headerId[0].id + ' #sectionScore').append(
      '[IRT Score: <strong>' + percent + '%</strong>]</span>');

  populateSectionCount(headerId, iframeObj.contentWindow.rTestPass,
      iframeObj.contentWindow.rTestFail, iframeObj.contentWindow.oTestPass,
      iframeObj.contentWindow.oTestFail, iframeObj.contentWindow.totalTest);
  dialogId.dialog("close");
  testId.css("display", "none");
  /*
   * $('html, body').animate({ 'scrollTop' : headerId.position().top });
   */
}

function enableDisableSaveResultButton(testName, id) {

  var iframeObj = null;
  var isTestCompleted = false;
  if (testName == 'HTML5') {
    iframeObj = document.getElementById('irpHTML5Test');
  } else if (testName == 'CSS3') {
    iframeObj = document.getElementById('irpCSS3Test');
  }
  var buttons = id.dialog("option", "buttons");
  if (iframeObj.contentWindow.isTestCompleted) {
    $('#dialogButton').button("enable");
  }
}

function populateIRPTestHeaderHTML(headerId, testName) {

  if (testName === 'TTS') {

  } else {

  }
}

function loadRunningForbiddenApps(forbiddenArrayFromApi) {

  var operatingSystem = Util.Browser.getOperatingSystem();

  var forbiddenArray = eval('IRT_FORBIDDEN.' + operatingSystem);

  var runningForbiddenArray = [];

  forbiddenArrayFromApi.forEach(function(apiItem, apiIndex, apiArray) {

    forbiddenArray.forEach(function(item, index, array) {

      if (apiItem == item.processname) {
        runningForbiddenArray.push(item);
      }

    });

  });

  return runningForbiddenArray;

}

function populateRunningForbiddenApplist(forbiddenArrayFromApi) {

  $("#forbiddenAppListGrid").jsGrid({
    width : "100%",
    height : 250,
    data : loadRunningForbiddenApps(forbiddenArrayFromApi),
    selecting : false,

    fields : [ {
      title : 'Description',
      name : "processdescription",
      type : "text",
      width : 200
    }, {
      title : 'Name',
      name : "processname",
      type : "text",
      width : 100
    }

    ]
  });
}

function recorderComponentInitialize() {

  createButton($("#initiateRecording"), 'Initiate', 'Initiate');
  createButton($("#getRecordingStatus"), 'Status', 'Status');
  createButton($("#getRecordingCapabilities"), 'Capabilities', 'Capabilities');
  createButton($("#startRecording"), 'Record', 'Start Recording');
  createButton($("#stopRecording"), 'Stop Recording', 'Stop Recording');
  createButton($("#startPlaybackRecording"), 'Play Recording', 'Play');
  createButton($("#pausePlaybackRecording"), 'Pause Playback', 'Pause');
  createButton($("#resumePlaybackRecording"), 'Resume Playback', 'Resume');
  createButton($("#stopPlaybackRecording"), 'Stop Playback', 'Stop');

  if (currentTestSetting == IRT.ProcessTest.UNKNOWN) {

    currentTestSetting = IRT.RecorderTest.INITIATE;

  }

  populateJsonGrid($("#recorderGrid"), 'RECORDER', false);

  disableUIOptions('RECORDER', specRecorderManualApi, recorderTestArray);
  enableUIOptions('RECORDER', specRecorderManualApi, recorderTestArray);

  if (Util.Validation.getAudioTestManualArray().length == 0) {
    populateReportGrid(recorderTestArray, recordermanual_section);
  }

}

function initiateRecorder() {

  recorderImpl.audioRecorderInitialize();
  setDialogHtml(specRecorderManualApi);
  loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);
}

function getRecorderStatus() {

  $('#recorderStatusText').html(recorderImpl.getAudioRecorderStatus());

  setDialogHtml(specRecorderManualApi);
  loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);
}

function getDeviceCapabilities() {
  $('#recorderInputOutputSelection').show();
  $('#concludeCapability').show();

  createSelectMenu($("#audioSource"), 'RECORDER_INPUT');
  createSelectMenu($("#audioOutput"), 'RECORDER_OUTPUT');

  createButton($("#concludeCapability"), 'Conclude Capability', 'Use');

  /* $('#concludeCapability').button('disable'); */

  recorderImpl.getDeviceRecorderCapabilities();
}

function concludeDeviceCapabilityTest() {

  if ($('#audioSource').val() != null && $('#audioSource').val() != undefined) {
    recorderImpl.initializeMediaRecorder($('#audioSource').val());
  }
  setDialogHtml(specRecorderManualApi);
  loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);
}

function startRecordingAudio() {

  var mediaRecorderStatusText = recorderImpl.startAudioRecording();
  $('#mediaRecorderStatusText').html(mediaRecorderStatusText);

  setDialogHtml(specRecorderManualApi);
  loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);

}

function stopRecordingAudio() {
  var mediaRecorderStatusText = recorderImpl.stopAudioRecording();
  $('#mediaRecorderStatusText').html(mediaRecorderStatusText);

  setDialogHtml(specRecorderManualApi);
  loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);
}

function setRecorderInput(label, value, index) {
  // $('#concludeCapability').button('enable');
  recorderImpl.setRecorderInputDevice(label, value, index);
}

function startPlaybackRecording() {

  recorderImpl.startAudioPlayback();

  if (currentTestSetting == IRT.RecorderTest.PLAY) {

    setDialogHtml(specRecorderManualApi);
    loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);
  }
}

function pausePlaybackRecording() {

  recorderImpl.pauseAudioPlayback();
  if (currentTestSetting == IRT.RecorderTest.PAUSE) {
    setDialogHtml(specRecorderManualApi);
    loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);
  }
}

function resumePlaybackRecording() {

  recorderImpl.resumeAudioPlayback();
  if (currentTestSetting == IRT.RecorderTest.RESUME) {
    setDialogHtml(specRecorderManualApi);
    loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);
  }
}

function stopPlaybackRecording() {
  currentTestSetting = IRT.RecorderTest.STOP;
  recorderImpl.stopAudioPlayback();
  setDialogHtml(specRecorderManualApi);
  loadTestDialogConfirm($('#recorderGrid'), 'RECORDER', specRecorderManualApi);
}