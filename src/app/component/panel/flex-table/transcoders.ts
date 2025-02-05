//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {IconStyle, IconStyler, Transcoder} from "../../../model/flex-table";
import {LabelService} from "../../../service/label.service";
import {TsActivation, TsStatus} from "../../../model/model";

//=============================================================================
//===
//=== Transcoders
//===
//=============================================================================

export class MapTranscoder implements Transcoder {
	constructor(private labelService : LabelService, private code : string) {
	}
	transcode(value: any, row?: any): string {
    return this.labelService.getLabelString("map."+ this.code +"."+ value)
	}
}

//=============================================================================

export class IntDateTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
    if (value == undefined || value == 0) {
      return ""
    }

    let d = String(value)
    return d.substring(0, 4) +"-"+ d.substring(4,6) +"-"+ d.substring(6,8)
  }
}

//=============================================================================

export class IsoDateTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
  if (value == null) {
    return ""
  }
    let d = String(value)
    return d.substring(0, 10)
  }
}

//=============================================================================

export class LabelTranscoder implements Transcoder {
  constructor(private labelService: LabelService, private base:string) {
  }
  transcode(value: number, row?: any): string {
    return this.labelService.getLabelString(this.base +"."+ value)
  }
}

//=============================================================================

export class ListLabelTranscoder implements Transcoder {
  constructor(private labelService: LabelService, private base:string) {
  }
  transcode(value: number, row?: any): string {
    return this.labelService.getLabel(this.base)[value]
  }
}

//=============================================================================

export class OperationTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
    return value == 0
      ? this.labelService.getLabel("map.operation.long")
      : this.labelService.getLabel("map.operation.short")
  }

  constructor(private labelService:LabelService) {}
}

//=============================================================================

export class DataPointTimeTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
    let d = String(value)
    return d.substring(0, 16).replace("T", " . . . . . ")
  }
}

//=============================================================================

export class DateTimeTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
    let d = String(value)
    return d.substring(0, 16).replace("T", " ")
  }
}

//=============================================================================

export class PositiveTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
    return (value >= 0) ? String(value) : ""
  }
}

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

export class ConnectionStyler implements IconStyler {

  getStyle(value : string, row? : any) : IconStyle {
    if (value != undefined && value != '') return FLAG_TRUE_RED;

    return FLAG_FALSE;
  }
}

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
    return (value == TsActivation.Manual) ? TS_ACTIVATION_MANUAL : TS_ACTIVATION_AUTO;
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
    if (value == 0) return STATUS_READY;
    if (value == 1) return STATUS_PROCESSING;

    return STATUS_ERROR;
  }
}

var STATUS_READY      = new IconStyle("done",  "#00A000");
var STATUS_PROCESSING = new IconStyle("build", "#0080FF");
var STATUS_ERROR      = new IconStyle("error", "#A00000");

//=============================================================================
