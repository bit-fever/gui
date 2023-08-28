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
  column?      : string;
  header?      : string;
  transcoder?  : Transcoder;
  iconStyler?  : IconStyler;
}

//=============================================================================

export type Transcoder = (value : any, row? : any) => string;

//=============================================================================

export type IconStyler = (value : any, row? : any) => IconStyle;


//=============================================================================

export class IconStyle {
  icon?  : string;
  color? : string;
}

//=============================================================================
