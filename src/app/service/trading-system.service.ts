//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}     from "@angular/core";
import {HttpService}    from "./http.service";
import {SessionService} from "./session.service";
import {Observable}     from "rxjs";
import {ListResponse, TradingSystem} from "../model/model";

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

  public getTradingSystems(): Observable<ListResponse<TradingSystem>> {
    return this.httpService.get('/api/portfolio/v1/trading-systems');
  }
}

//=============================================================================
