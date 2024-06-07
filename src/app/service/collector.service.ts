//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}        from "@angular/core";
import {Observable}        from "rxjs";
import {ListResponse}      from "../model/flex-table";
import {
  Connection,
  ConnectionSpec, Currency, Exchange, DatafileUploadSpec, InstrumentData, InvTradingSystem,
  InvTradingSystemFull, Portfolio, PortfolioTree,
  ProductBroker, ProductBrokerSpec,
  ProductData, ProductDataExt, ProductDataSpec,
  TradingSession, TradingSystemSpec, DatafileUploadResponse
} from "../model/model";
import {HttpService, UploadEvent} from "./http.service";
import {HttpParams} from "@angular/common/http";

//=============================================================================

@Injectable()
export class CollectorService {

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
  //--- Product data
  //---------------------------------------------------------------------------

  public getInstrumentsByDataId = (id: number): Observable<ListResponse<InstrumentData>> => {
    return this.httpService.get<ListResponse<InstrumentData>>('/api/inventory/v1/product-data/'+id+'/instruments');
  }

  //---------------------------------------------------------------------------

  public uploadInstrumentData = (productId: number, spec: DatafileUploadSpec, files: any[]) : Observable<UploadEvent<DatafileUploadResponse>> => {
    return this.httpService.upload<DatafileUploadResponse>('/api/inventory/v1/product-data/'+ productId +'/instruments', spec, files)
  }
}

//=============================================================================
