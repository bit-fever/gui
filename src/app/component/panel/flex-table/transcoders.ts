//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {IconStyle, IconStyler, Transcoder} from "../../../model/flex-table";

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
    let d = String(value)
    return d.substring(0, 4) +"-"+ d.substring(4,6) +"-"+ d.substring(6,8)
  }
}

//=============================================================================

export class SuggestedActionTranscoder implements IconStyler {

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
