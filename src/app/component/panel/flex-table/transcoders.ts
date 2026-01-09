//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Transcoder} from "../../../model/flex-table";
import {LabelService} from "../../../service/label.service";

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
  transcode(value: number|undefined, row?: any): string {
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
  constructor(private labelService: LabelService, private base:string, private offset:number=0) {
  }
  transcode(value: number, row?: any): string {
    return this.labelService.getLabel(this.base)[value + this.offset]
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
