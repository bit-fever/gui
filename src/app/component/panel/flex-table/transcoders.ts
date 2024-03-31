//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {IconStyle, IconStyler, Transcoder} from "../../../model/flex-table";
import {LabelService} from "../../../service/label.service";

//=============================================================================
//===
//=== Transcoders
//===
//=============================================================================

export class MapTranscoder implements Transcoder {
	constructor() {
	}
	transcode(value: any, row?: any): string {
		return "";
	}

}

//=============================================================================

export class IntDateTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
    if (value == 0) {
      return ""
    }

    let d = String(value)
    return d.substring(0, 4) +"-"+ d.substring(4,6) +"-"+ d.substring(6,8)
  }
}

//=============================================================================

export class IsoDateTranscoder implements Transcoder {
  transcode(value: number, row?: any): string {
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

export class TradingSystemStatusStyler implements IconStyler {

  getStyle(value : string, row? : any) : IconStyle {
    if (value == 'en') return TS_STATUS_ENABLED;

    return TS_STATUS_DISABLED;
  }
}

var TS_STATUS_DISABLED= new IconStyle("radio_button_unchecked", "#A0A0A0");
var TS_STATUS_ENABLED = new IconStyle("radio_button_checked",   "#00A000");

//=============================================================================
