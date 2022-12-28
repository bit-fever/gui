//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

//=============================================================================

@Injectable()
export class SearchService {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  private _search = new Subject<string>();
  public search$ = this._search.asObservable();

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  set search(value: string | undefined) {
    if (value != undefined) {
      this._search.next(value);
    }
  }

  //-------------------------------------------------------------------------

  public filter(search?: string, label?: string): boolean {
    if (!search || !label) {
      return false;
    }

    return !label.toLowerCase().includes(search.toLowerCase());
  }
}

//=============================================================================
