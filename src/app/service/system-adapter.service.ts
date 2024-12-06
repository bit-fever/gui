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
import {Adapter, ConnectionRequest, ConnectionResult, ConnectionSpec} from "../model/model";

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

  public connect = (cr : ConnectionRequest): Observable<ConnectionResult> => {
    return this.httpService.post<ConnectionResult>('/api/system/v1/connections', cr);
  }
}

//=============================================================================
