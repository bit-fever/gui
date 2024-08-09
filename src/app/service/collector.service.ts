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
  DatafileUploadSpec, InstrumentData, DatafileUploadResponse, ParserMap, DataPoint, InstrumentDataResponse
} from "../model/model";
import {HttpService, UploadEvent} from "./http.service";
import { HttpHeaders, HttpParams, HttpParamsOptions } from "@angular/common/http";

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

  public getParsers = (): Observable<ParserMap> => {
    return this.httpService.get<ParserMap>('/api/collector/v1/config/parsers');
  }

  //---------------------------------------------------------------------------

  public getInstrumentsByProductId = (id: number): Observable<ListResponse<InstrumentData>> => {
    return this.httpService.get<ListResponse<InstrumentData>>('/api/collector/v1/products/'+id+'/instruments');
  }

  //---------------------------------------------------------------------------

  public uploadInstrumentData = (productId: number, spec: DatafileUploadSpec, files: any[]) : Observable<UploadEvent<DatafileUploadResponse>> => {
    return this.httpService.upload<DatafileUploadResponse>('/api/collector/v1/products/'+ productId +'/instruments', spec, files)
  }

  //---------------------------------------------------------------------------

  public getInstrumentData = (id: number, from:string, to:string, timeframe:string, timezone:string, reduction:number): Observable<InstrumentDataResponse> => {
    let options= {
      params: {
        from     : from,
        to       : to,
        timeframe: timeframe,
        timezone : timezone,
        reduction: reduction,
      },
    }

    return this.httpService.get<InstrumentDataResponse>('/api/collector/v1/instruments/'+id+'/data', options);
  }
}

//=============================================================================
