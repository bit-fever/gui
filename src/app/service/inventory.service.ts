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
  ConnectionSpec, Currency, Exchange, InstrumentData, InvTradingSystem,
  InvTradingSystemFull, Portfolio, PortfolioTree,
  ProductBroker, ProductBrokerSpec,
  ProductData, ProductDataExt, ProductDataSpec,
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
  //--- Product data
  //---------------------------------------------------------------------------

  public getProductData = (details: boolean): Observable<ListResponse<ProductData>> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ListResponse<ProductData>>('/api/inventory/v1/product-data', { params: params });
  }

  //---------------------------------------------------------------------------

  public getProductDataById = (id:number, details: boolean): Observable<ProductDataExt> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ProductDataExt>('/api/inventory/v1/product-data/'+ id, { params: params });
  }

  //---------------------------------------------------------------------------

  public addProductData = (pds : ProductDataSpec): Observable<ProductData> => {
    return this.httpService.post<ProductData>('/api/inventory/v1/product-data', pds);
  }

  //---------------------------------------------------------------------------

  public updateProductData = (pds : ProductDataSpec): Observable<ProductData> => {
    return this.httpService.put<ProductData>('/api/inventory/v1/product-data/'+pds.id, pds);
  }

  //---------------------------------------------------------------------------

  public getInstrumentsByDataId = (id: number): Observable<ListResponse<InstrumentData>> => {
    return this.httpService.get<ListResponse<InstrumentData>>('/api/inventory/v1/product-data/'+id+'/instruments');
  }

  //---------------------------------------------------------------------------
  //--- Product brokers
  //---------------------------------------------------------------------------

  public getProductBrokers = (details: boolean): Observable<ListResponse<ProductBroker>> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ListResponse<ProductBroker>>('/api/inventory/v1/product-brokers', { params: params });
  }

  //---------------------------------------------------------------------------

  public addProductBroker = (pbs : ProductBrokerSpec): Observable<ProductBroker> => {
    return this.httpService.post<ProductBroker>('/api/inventory/v1/product-broker', pbs);
  }

  //---------------------------------------------------------------------------

  public updateProductBroker = (pbs : ProductBrokerSpec): Observable<ProductBroker> => {
    return this.httpService.put<ProductBroker>('/api/inventory/v1/product-broker/'+pbs.id, pbs);
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
