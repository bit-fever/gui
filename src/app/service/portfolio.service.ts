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
  FilterAnalysisRequest,
  FilterAnalysisResponse,
  FilterOptimizationResponse,
  FilterOptimizationRequest,
  PortfolioMonitoringResponse,
  PorTradingSystem,
  StatusResponse,
  TradingFilter,
  TradingSystemPropertyResponse,
  Portfolio,
  PortfolioTree,
  FinalizationResponse,
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

  public setTradingSystemTrading = (id: number, value: boolean): Observable<TradingSystemPropertyResponse> => {
    return this.httpService.post<TradingSystemPropertyResponse>('/api/portfolio/v1/trading-systems/'+ id +'/trading', { value: value });
  }

  //---------------------------------------------------------------------------

  public setTradingSystemRunning = (id: number, value: boolean): Observable<TradingSystemPropertyResponse> => {
    return this.httpService.post<TradingSystemPropertyResponse>('/api/portfolio/v1/trading-systems/'+ id +'/running', { value: value });
  }

  //---------------------------------------------------------------------------

  public setTradingSystemActivation = (id: number, value: boolean): Observable<TradingSystemPropertyResponse> => {
    return this.httpService.post<TradingSystemPropertyResponse>('/api/portfolio/v1/trading-systems/'+ id +'/activation', { value: value });
  }

  //---------------------------------------------------------------------------

  public setTradingSystemActive = (id: number, value: boolean): Observable<TradingSystemPropertyResponse> => {
    return this.httpService.post<TradingSystemPropertyResponse>('/api/portfolio/v1/trading-systems/'+ id +'/active', { value: value });
  }

  //---------------------------------------------------------------------------
  //--- Filtering
  //---------------------------------------------------------------------------

  public getTradingFilters = (tsId : number): Observable<TradingFilter> => {
    return this.httpService.get<TradingFilter>('/api/portfolio/v1/trading-systems/'+ tsId +'/filters');
  }

  //---------------------------------------------------------------------------

  public setTradingFilters = (tsId : number, filters : TradingFilter): Observable<string> => {
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

  public getPortfolios = (): Observable<ListResponse<Portfolio>> => {
    return this.httpService.get<ListResponse<Portfolio>>('/api/portfolio/v1/portfolios');
  }

  //---------------------------------------------------------------------------

  public getPortfolioTree = (): Observable<PortfolioTree[]> => {
    return this.httpService.get<PortfolioTree[]>('/api/portfolio/v1/portfolio/tree');
  }

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
