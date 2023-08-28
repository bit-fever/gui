//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}     from "@angular/core";
import {HttpService}    from "./http.service";
import {Observable}     from "rxjs";
import {TradingSystem}  from "../model/model";
import {ListResponse}   from "../model/flex-table";

//=============================================================================

@Injectable()
export class TradingSystemService {

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(private httpService: HttpService) {

  }

  //---------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //---------------------------------------------------------------------------

  public getTradingSystems = (): Observable<ListResponse<TradingSystem>> => {
    return this.httpService.get<ListResponse<TradingSystem>>('/api/portfolio/v1/trading-systems');
  }
}

//=============================================================================
