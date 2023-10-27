//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}        from "@angular/core";
import {Observable}        from "rxjs";
import {ListResponse}      from "../model/flex-table";
import {HttpService}       from "./http.service";
import {FilteringParams, FilteringResponse, TradingSystemFull} from "../model/model";

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

  //---------------------------------------------------------------------------

  public getFilteringAnalysis = (tsId : number, params : FilteringParams|null): Observable<FilteringResponse> => {
    return this.httpService.post<FilteringResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filtering-analysis', params);
  }
}

//=============================================================================
