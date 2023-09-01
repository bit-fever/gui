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
  column      : string;
  header      : string;
  transcoder?  : Transcoder;
  iconStyler?  : IconStyler;

  constructor(obj:any, column : string, transCoder? : Transcoder, iconStyler? : IconStyler) {
    this.column     = column;
    this.header     = obj[column];
    this.transcoder = transCoder;
    this.iconStyler = iconStyler;
  }
}

//=============================================================================

export interface Transcoder {
	transcode(value: any, row?: any): string;
}

//=============================================================================

export interface IconStyler {
	getStyle(value : any, row? : any) : IconStyle;
}

//=============================================================================

export class IconStyle {
  icon?  : string;
  color? : string;

  constructor(icon : string, color? : string) {
    this.icon = icon;
    this.color= color;
  }
}

//=============================================================================
