//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}        from "@angular/core";
import {Observable}        from "rxjs";
import {TradingSystemFull} from "../model/model";
import {ListResponse}      from "../model/flex-table";
import {HttpService}       from "./http.service";

//=============================================================================

@Injectable()
export class TradingSystemService {

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(private httpService: HttpService) {}

  //---------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //---------------------------------------------------------------------------

  public getTradingSystems = (): Observable<ListResponse<TradingSystemFull>> => {
    return this.httpService.get<ListResponse<TradingSystemFull>>('/api/portfolio/v1/trading-systems');
  }
}

//=============================================================================
