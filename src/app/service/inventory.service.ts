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
import {
  Connection,
  ConnectionSpec, InvTradingSystem,
  InvTradingSystemFull, Portfolio, PortfolioTree,
  ProductBroker,
  ProductFeed,
  TradingSession, TradingSystemSpec
} from "../model/model";
import {HttpService}       from "./http.service";
import {HttpParams} from "@angular/common/http";

//=============================================================================

@Injectable()
export class InventoryService {

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
  //--- Connections
  //---------------------------------------------------------------------------

  public getConnections = (): Observable<ListResponse<Connection>> => {
    return this.httpService.get<ListResponse<Connection>>('/api/inventory/v1/connections');
  }

  //---------------------------------------------------------------------------

  public addConnection = (cs : ConnectionSpec): Observable<Connection> => {
    return this.httpService.post<Connection>('/api/inventory/v1/connections', cs);
  }

  //---------------------------------------------------------------------------
  //--- Product feeds
  //---------------------------------------------------------------------------

  public getProductFeeds = (details: boolean): Observable<ListResponse<ProductFeed>> => {
    return this.httpService.get<ListResponse<ProductFeed>>('/api/inventory/v1/product-feeds');
  }

  //---------------------------------------------------------------------------
  //--- Product brokers
  //---------------------------------------------------------------------------

  public getProductBrokers = (details: boolean): Observable<ListResponse<ProductBroker>> => {
    return this.httpService.get<ListResponse<ProductBroker>>('/api/inventory/v1/product-brokers');
  }

  //---------------------------------------------------------------------------
  //--- Trading sessions
  //---------------------------------------------------------------------------

  public getTradingSessions = (): Observable<ListResponse<TradingSession>> => {
    return this.httpService.get<ListResponse<TradingSession>>('/api/inventory/v1/trading-sessions');
  }

  //---------------------------------------------------------------------------
  //--- Trading systems
  //---------------------------------------------------------------------------

  public getTradingSystems = (details : boolean): Observable<ListResponse<InvTradingSystemFull>> => {
    let params = new HttpParams()
    params = params.set("details", true)
    return this.httpService.get<ListResponse<InvTradingSystemFull>>('/api/inventory/v1/trading-systems', { params: params });
  }

  //---------------------------------------------------------------------------

  public addTradingSystem = (tss : TradingSystemSpec): Observable<InvTradingSystem> => {
    return this.httpService.post<InvTradingSystem>('/api/inventory/v1/trading-systems', tss);
  }

  //---------------------------------------------------------------------------

  public updateTradingSystem = (tss : TradingSystemSpec): Observable<InvTradingSystem> => {
    return this.httpService.put<InvTradingSystem>('/api/inventory/v1/trading-systems', tss);
  }

  //---------------------------------------------------------------------------
  //--- Portfolios
  //---------------------------------------------------------------------------

  public getPortfolios = (): Observable<ListResponse<Portfolio>> => {
    return this.httpService.get<ListResponse<Portfolio>>('/api/inventory/v1/portfolios');
  }

  //---------------------------------------------------------------------------

  public getPortfolioTree = (): Observable<PortfolioTree[]> => {
    return this.httpService.get<PortfolioTree[]>('/api/inventory/v1/portfolio/tree');
  }
}

//=============================================================================
