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
  ConnectionSpec, Currency, Exchange, DatafileUploadSpec, DataInstrument, InvTradingSystem,
  InvTradingSystemFull, Portfolio, PortfolioTree,
  BrokerProduct, BrokerProductSpec,
  DataProduct, DataProductExt, DataProductSpec,
  TradingSession, TradingSystemSpec, DatafileUploadResponse
} from "../model/model";
import {HttpService, UploadEvent} from "./http.service";
import { HttpParams } from "@angular/common/http";

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

  public getCurrencies = (): Observable<ListResponse<Currency>> => {
    return this.httpService.get<ListResponse<Currency>>('/api/inventory/v1/currencies');
  }

  //---------------------------------------------------------------------------

  public getExchanges = (): Observable<ListResponse<Exchange>> => {
    return this.httpService.get<ListResponse<Exchange>>('/api/inventory/v1/exchanges');
  }

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
  //--- Product tool
  //---------------------------------------------------------------------------

  public getDataProducts = (details: boolean): Observable<ListResponse<DataProduct>> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ListResponse<DataProduct>>('/api/inventory/v1/data-products', { params: params });
  }

  //---------------------------------------------------------------------------

  public getDataProductById = (id:number, details: boolean): Observable<DataProductExt> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<DataProductExt>('/api/inventory/v1/data-products/'+ id, { params: params });
  }

  //---------------------------------------------------------------------------

  public addDataProduct = (pds : DataProductSpec): Observable<DataProduct> => {
    return this.httpService.post<DataProduct>('/api/inventory/v1/data-products', pds);
  }

  //---------------------------------------------------------------------------

  public updateDataProduct = (pds : DataProductSpec): Observable<DataProduct> => {
    return this.httpService.put<DataProduct>('/api/inventory/v1/data-products/'+pds.id, pds);
  }

  //---------------------------------------------------------------------------
  //--- Product brokers
  //---------------------------------------------------------------------------

  public getBrokerProducts = (details: boolean): Observable<ListResponse<BrokerProduct>> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ListResponse<BrokerProduct>>('/api/inventory/v1/broker-products', { params: params });
  }

  //---------------------------------------------------------------------------

  public addBrokerProduct = (pbs : BrokerProductSpec): Observable<BrokerProduct> => {
    return this.httpService.post<BrokerProduct>('/api/inventory/v1/broker-products', pbs);
  }

  //---------------------------------------------------------------------------

  public updateBrokerProduct = (pbs : BrokerProductSpec): Observable<BrokerProduct> => {
    return this.httpService.put<BrokerProduct>('/api/inventory/v1/broker-products/'+pbs.id, pbs);
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
    params = params.set("details", details)
    return this.httpService.get<ListResponse<InvTradingSystemFull>>('/api/inventory/v1/trading-systems', { params: params });
  }

  //---------------------------------------------------------------------------

  public addTradingSystem = (tss : TradingSystemSpec): Observable<InvTradingSystem> => {
    return this.httpService.post<InvTradingSystem>('/api/inventory/v1/trading-systems', tss);
  }

  //---------------------------------------------------------------------------

  public updateTradingSystem = (tss : TradingSystemSpec): Observable<InvTradingSystem> => {
    return this.httpService.put<InvTradingSystem>('/api/inventory/v1/trading-systems/'+ tss.id, tss);
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
