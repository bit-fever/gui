//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Observable} from "rxjs";

//=============================================================================

export class ListResponse<T = any> {
  offset  : number  = 0;
  limit   : number  = 0;
  overflow: boolean = false;
  result  : T[]     = [];
}

//=============================================================================

export type ListService<T> = (params? : any) => Observable<ListResponse<T>>;

//=============================================================================

export class FlexTableColumn {
  column      : string
  header      : string
  transcoder? : Transcoder
  iconStyler? : IconStyler
  cellStyler? : CellStyler

  constructor(obj:any, column : string, transCoder? : Transcoder, iconStyler? : IconStyler, cellStyler? : CellStyler) {
    this.column     = column;
    this.header     = obj[column];
    this.transcoder = transCoder;
    this.iconStyler = iconStyler;
    this.cellStyler = cellStyler;
  }

  //---------------------------------------------------------------------------

  transcode(value: any, row: any) : string {
    if (this.transcoder != undefined) {
      return this.transcoder.transcode(value, row)
    }

    return value
  }

  //---------------------------------------------------------------------------

  cellStyle(value: any, row: any) : string {
    if (this.cellStyler != undefined) {
      return this.cellStyler.getCellStyle(value, row)
    }

    return ""
  }
}

//=============================================================================

export interface Transcoder {
	transcode(value: any, row?: any): any;
}

//=============================================================================

export interface IconStyler {
	getStyle(value : any, row? : any) : IconStyle;
}

//=============================================================================

export interface CellStyler {
  getCellStyle(value : any, row? : any) : string;
}

//=============================================================================

export class IconStyle {
  icon?   : string
  color?  : string
  tooltip?: string

  constructor(icon : string, color? : string, tooltip? : string) {
    this.icon    = icon
    this.color   = color
    this.tooltip = tooltip
  }
}

//=============================================================================
