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
import {
  Adapter,
  ConnectionRequest,
  ConnectionResult,
  ConnectionSpec,
  RootSymbol,
  TestAdapterRequest
} from "../model/model";
import {HttpParams} from "@angular/common/http";

//=============================================================================

@Injectable()
export class SystemAdapterService {

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

  public getAdapters = (): Observable<ListResponse<Adapter>> => {
    return this.httpService.get<ListResponse<Adapter>>('/api/system/v1/adapters');
  }

  //---------------------------------------------------------------------------

  public getAdapter = (code : string): Observable<Adapter> => {
    return this.httpService.get<Adapter>('/api/system/v1/adapters/'+code);
  }

  //---------------------------------------------------------------------------

  public connect = (connectionCode : string, cr : ConnectionRequest): Observable<ConnectionResult> => {
    return this.httpService.put<ConnectionResult>('/api/system/v1/connections/'+ connectionCode, cr);
  }

  //---------------------------------------------------------------------------

  public getRootSymbols = (connectionCode : string, filter : string): Observable<ListResponse<RootSymbol>> => {
    let params = new HttpParams()
    params = params.set("filter", filter)

    return this.httpService.get<ListResponse<RootSymbol>>('/api/system/v1/connections/'+ connectionCode +"/roots", { params: params });
  }

  //---------------------------------------------------------------------------

  public getRootSymbol = (connectionCode : string, root : string): Observable<RootSymbol> => {
    return this.httpService.get<RootSymbol>('/api/system/v1/connections/'+ connectionCode +"/roots/"+root);
  }

  //---------------------------------------------------------------------------

  public testAdapter = (connectionCode : string, tar : TestAdapterRequest): Observable<string> => {
    return this.httpService.post<string>('/api/system/v1/connections/'+ connectionCode +"/test", tar);
  }
}

//=============================================================================
