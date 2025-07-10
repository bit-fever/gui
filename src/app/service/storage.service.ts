//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}  from "@angular/core";
import {Observable}  from "rxjs";
import {HttpService} from "./http.service";

//=============================================================================

@Injectable()
export class StorageService {

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

  public getEquityChart = (id:number, type:string): Observable<ArrayBuffer> => {
    return this.httpService.getBytes('/api/storage/v1/trading-systems/'+ id +'/equity-chart?type='+type);
  }

  //---------------------------------------------------------------------------

  public getTradingSystemDoc = (id:number): Observable<DocumentationResponse> => {
    return this.httpService.get<DocumentationResponse>('/api/storage/v1/trading-systems/'+ id +'/documentation');
  }

  //---------------------------------------------------------------------------

  public setTradingSystemDoc = (id:number, doc:string): Observable<void> => {
    let req = new DocumentationRequest()
    req.documentation = doc

    return this.httpService.put('/api/storage/v1/trading-systems/'+ id +'/documentation', req);
  }
}

//=============================================================================

export class DocumentationRequest {
  documentation : string = ""
}

//=============================================================================

export class DocumentationResponse {
  id            : number = 0
  name          : string = ""
  documentation : string = ""
}

//=============================================================================
