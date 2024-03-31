//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}      from "@angular/core";
import {Observable}      from "rxjs";
import {
  FilterAnalysisRequest, FilterAnalysisResponse, FilterOptimizationResponse, FilterOptimizationRequest,
  PortfolioMonitoringResponse,
  PorTradingSystem, StatusResponse, TradingFilters,
} from "../model/model";
import {HttpService}     from "./http.service";
import {ListResponse} from "../model/flex-table";

//=============================================================================

@Injectable()
export class PortfolioService {

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

  //---------------------------------------------------------------------------
  //--- Trading systems
  //---------------------------------------------------------------------------

  public getTradingSystems = (): Observable<ListResponse<PorTradingSystem>> => {
    return this.httpService.get<ListResponse<PorTradingSystem>>('/api/portfolio/v1/trading-systems');
  }

  //---------------------------------------------------------------------------
  //--- Filtering
  //---------------------------------------------------------------------------

  public getTradingFilters = (tsId : number): Observable<TradingFilters> => {
    return this.httpService.get<TradingFilters>('/api/portfolio/v1/trading-systems/'+ tsId +'/filters');
  }

  //---------------------------------------------------------------------------

  public setTradingFilters = (tsId : number, filters : TradingFilters): Observable<string> => {
    return this.httpService.post<string>('/api/portfolio/v1/trading-systems/'+ tsId +'/filters', filters);
  }

  //---------------------------------------------------------------------------

  public runFilterAnalysis = (tsId : number, req : FilterAnalysisRequest): Observable<FilterAnalysisResponse> => {
    return this.httpService.post<FilterAnalysisResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filter-analysis', req);
  }

  //---------------------------------------------------------------------------

  public startFilterOptimization = (tsId : number, req : FilterOptimizationRequest): Observable<StatusResponse> => {
    return this.httpService.post<StatusResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filter-optimization', req);
  }

  //---------------------------------------------------------------------------

  public stopFilterOptimization = (tsId : number): Observable<StatusResponse> => {
    return this.httpService.delete<StatusResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filter-optimization');
  }

  //---------------------------------------------------------------------------

  public getFilterOptimizationInfo = (tsId : number): Observable<FilterOptimizationResponse> => {
    return this.httpService.get<FilterOptimizationResponse>('/api/portfolio/v1/trading-systems/'+ tsId +'/filter-optimization');
  }

  //---------------------------------------------------------------------------
  //--- Portfolios
  //---------------------------------------------------------------------------

  public getPortfolioMonitoring = (ids : number[], period : number): Observable<PortfolioMonitoringResponse> => {

    let params = {
      "tsIds" : ids,
      "period": period
    };

    return this.httpService.post<PortfolioMonitoringResponse>('/api/portfolio/v1/portfolio/monitoring', params);
  }
}

//=============================================================================
