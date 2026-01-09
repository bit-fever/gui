//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {CellStyler, IconStyle, IconStyler} from "../../../model/flex-table";
import {DataInstrumentExt, DIRStatus, TsStatus} from "../../../model/model";

//=============================================================================
//===
//=== Icon stylers
//===
//=============================================================================

export class SuggestedActionStyler implements IconStyler {

  getStyle(value : number, row? : any) : IconStyle {
    if (value == 1) return SA_ACTIVATE;
    if (value == 2) return SA_DEACTIVATE;

    return SA_NONE;
  }
}

var SA_NONE       = new IconStyle("trending_flat", "#A0A0A0");
var SA_ACTIVATE   = new IconStyle("trending_up",   "#00A000");
var SA_DEACTIVATE = new IconStyle("trending_down", "#A00000");

//=============================================================================

export class FlagStyler implements IconStyler {

  getStyle(value : boolean, row? : any) : IconStyle {
    if (value) return FLAG_TRUE_GREEN;

    return FLAG_FALSE;
  }
}

var FLAG_FALSE      = new IconStyle("radio_button_unchecked", "#A0A0A0");
var FLAG_TRUE_GREEN = new IconStyle("radio_button_checked",   "#00A000");
var FLAG_TRUE_RED   = new IconStyle("radio_button_checked",   "#A00000");

//=============================================================================

export class TradingSystemRunningStyler implements IconStyler {

  getStyle(value : boolean, row? : any) : IconStyle {
    return value ? TS_RUNNING_ON : TS_RUNNING_OFF;
  }
}

var TS_RUNNING_OFF  = new IconStyle("mode_off_on", "#A0A0A0", "Stopped");
var TS_RUNNING_ON   = new IconStyle("mode_off_on", "#00A000", "Running");

//=============================================================================

export class TradingSystemActivationStyler implements IconStyler {

  getStyle(value : number, row? : any) : IconStyle {
    return value ? TS_ACTIVATION_AUTO : TS_ACTIVATION_MANUAL;
  }
}

var TS_ACTIVATION_MANUAL = new IconStyle("airline_seat_recline_normal", "#A00080", "Manual");
var TS_ACTIVATION_AUTO   = new IconStyle("time_auto",                   "#0080C0", "Auto");

//=============================================================================

export class TradingSystemActiveStyler implements IconStyler {

  getStyle(value : boolean, row? : any) : IconStyle {
    return (value) ? TS_ACTIVE_ON : TS_ACTIVE_OFF;
  }
}

var TS_ACTIVE_OFF = new IconStyle("toggle_off", "#A0A0A0", "Inactive");
var TS_ACTIVE_ON  = new IconStyle("toggle_on",  "#00A000", "Active");

//=============================================================================

export class TradingSystemStatusStyler implements IconStyler {

  getStyle(value : number, row? : any) : IconStyle {
    switch (value) {
      case TsStatus.Off    : return TS_STATUS_OFF
      case TsStatus.Paused : return TS_STATUS_PAUSED
      case TsStatus.Running: return TS_STATUS_RUNNING
      case TsStatus.Idle   : return TS_STATUS_IDLE

      default: return TS_STATUS_BROKEN
    }
  }
}

var TS_STATUS_OFF    = new IconStyle("radio_button_unchecked", "#A0A0A0", "Off");
var TS_STATUS_PAUSED = new IconStyle("pause_circle",           "#0080C0", "Paused");
var TS_STATUS_RUNNING= new IconStyle("run_circle",             "#00A000", "Running");
var TS_STATUS_IDLE   = new IconStyle("schedule",               "#C0C000", "Idle");
var TS_STATUS_BROKEN = new IconStyle("heart_broken",           "#E03000", "Broken");

//=============================================================================

export class InstrumentStatusStyler implements IconStyler {
  getStyle(value : number, row? : any) : IconStyle {
    if (row) {
      let vi = <DataInstrumentExt> row
      if (vi.virtualInstrument) {
        let status = vi.rolloverStatus

        if (status==DIRStatus.Waiting) return STATUS_WAITING
        if (status==DIRStatus.Ready)   return STATUS_READY

        return STATUS_READY_BUT
      }
    }

    if (value == undefined) return STATUS_NOTSTORED

    if (value == 0) return STATUS_READY;
    if (value == 1) return STATUS_WAITING;
    if (value == 2) return STATUS_LOADING;
    if (value == 3) return STATUS_PROCESSING;
    if (value == 4) return STATUS_SLEEPING;
    if (value == 5) return STATUS_EMPTY;

    return STATUS_ERROR;
  }
}

var STATUS_NOTSTORED  = new IconStyle("database_off",     "#605030", "Not stored");
var STATUS_WAITING    = new IconStyle("hourglass",        "#A0A0A0", "Waiting");
var STATUS_LOADING    = new IconStyle("database_upload",  "#0080FF", "Loading");
var STATUS_PROCESSING = new IconStyle("build",            "#A040A0", "Processing");
var STATUS_READY      = new IconStyle("done",             "#00A000", "Ready");
var STATUS_ERROR      = new IconStyle("error",            "#A00000", "Error");
var STATUS_SLEEPING   = new IconStyle("snooze",           "#A0A000", "Sleeping");
var STATUS_EMPTY      = new IconStyle("unknown_document", "#C04010", "Empty");
var STATUS_READY_BUT  = new IconStyle("done",             "#C04010", "Ready but not fully available");

//=============================================================================

export class RolloverStatusStyler implements IconStyler {

  getStyle(value : number, row? : any) : IconStyle {
    if (value ==  0) return ROLLOVER_WAITING;
    if (value ==  1) return ROLLOVER_READY;
    if (value == -1) return ROLLOVER_NOMATCH;
    if (value == -2) return ROLLOVER_NODATA;

    return STATUS_ERROR;
  }
}

var ROLLOVER_WAITING  = new IconStyle("hourglass",        "#A0A0A0", "Waiting");
var ROLLOVER_READY    = new IconStyle("done",             "#00A000", "Ready");
var ROLLOVER_NOMATCH  = new IconStyle("data_alert",       "#A00000", "No match");
var ROLLOVER_NODATA   = new IconStyle("unknown_document", "#C04010", "No data");

//=============================================================================

export class NumericClassStyler implements CellStyler {

  getCellStyle(value : number, row? : any) : string {
    let style = "text-align: right;";
    if (value > 0) return style+"color: #00A000;";
    if (value < 0) return style+"color: #A00000;";

    return "";
  }
}

//=============================================================================
