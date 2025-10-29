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
  TradingSession, TradingSystemSpec, DatafileUploadResponse, AgentProfile, FinalizationResponse, DataProductFull,
  BrokerProductExt, BrokerProductFull
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

  public updateConnection = (cs : ConnectionSpec): Observable<Connection> => {
    return this.httpService.put<Connection>('/api/inventory/v1/connections/'+cs.id, cs);
  }

  //---------------------------------------------------------------------------
  //--- Product tool
  //---------------------------------------------------------------------------

  public getDataProducts = (details: boolean): Observable<ListResponse<DataProductFull>> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ListResponse<DataProductFull>>('/api/inventory/v1/data-products', { params: params });
  }

  //---------------------------------------------------------------------------

  public getDataProductById = (id:number): Observable<DataProductExt> => {
    let params = new HttpParams()
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

  public getBrokerProducts = (details: boolean): Observable<ListResponse<BrokerProductFull>> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ListResponse<BrokerProductFull>>('/api/inventory/v1/broker-products', { params: params });
  }

  //---------------------------------------------------------------------------

  public getBrokerProductById = (id:number): Observable<BrokerProductExt> => {
    let params = new HttpParams()
    return this.httpService.get<BrokerProductExt>('/api/inventory/v1/broker-products/'+ id, { params: params });
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

  public deleteTradingSystem = (id: number): Observable<InvTradingSystem> => {
    return this.httpService.delete<InvTradingSystem>('/api/inventory/v1/trading-systems/'+ id);
  }

  //---------------------------------------------------------------------------

  public finalizeTradingSystem = (id: number): Observable<FinalizationResponse> => {
    return this.httpService.post<FinalizationResponse>('/api/inventory/v1/trading-systems/'+ id +'/finalize', {});
  }

  //---------------------------------------------------------------------------
  //--- Agent profiles
  //---------------------------------------------------------------------------

  public getAgentProfiles = (): Observable<ListResponse<AgentProfile>> => {
    return this.httpService.get<ListResponse<AgentProfile>>('/api/inventory/v1/agent-profiles');
  }
}

//=============================================================================
