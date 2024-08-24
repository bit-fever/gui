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
  DatafileUploadSpec,
  DataInstrument,
  DatafileUploadResponse,
  ParserMap,
  DataPoint,
  DataInstrumentDataResponse,
  DataInstrumentFull, DataProductExt, BiasSummaryResponse
} from "../model/model";
import {HttpService, UploadEvent} from "./http.service";

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
  //--- Products & Instruments
  //---------------------------------------------------------------------------

  public getParsers = (): Observable<ParserMap> => {
    return this.httpService.get<ParserMap>('/api/collector/v1/config/parsers');
  }

  //---------------------------------------------------------------------------

  public getDataInstruments = (): Observable<ListResponse<DataInstrumentFull>> => {
    return this.httpService.get<ListResponse<DataInstrumentFull>>('/api/collector/v1/data-instruments');
  }

  //---------------------------------------------------------------------------

  public getDataInstrumentsByProductId = (id: number): Observable<ListResponse<DataInstrument>> => {
    return this.httpService.get<ListResponse<DataInstrument>>('/api/collector/v1/data-products/'+id+'/instruments');
  }

  //---------------------------------------------------------------------------

  public uploadDataInstrumentData = (productId: number, spec: DatafileUploadSpec, files: any[]) : Observable<UploadEvent<DatafileUploadResponse>> => {
    return this.httpService.upload<DatafileUploadResponse>('/api/collector/v1/data-products/'+ productId +'/instruments', spec, files)
  }

  //---------------------------------------------------------------------------

  public getDataInstrumentData = (id: number, from:string, to:string, timeframe:string, timezone:string, reduction:number): Observable<DataInstrumentDataResponse> => {
    let options= {
      params: {
        from     : from,
        to       : to,
        timeframe: timeframe,
        timezone : timezone,
        reduction: reduction,
      },
    }

    return this.httpService.get<DataInstrumentDataResponse>('/api/collector/v1/data-instruments/'+id+'/data', options);
  }

  //---------------------------------------------------------------------------
  //--- Bias analyses
  //---------------------------------------------------------------------------

  public getBiasSummary = (id:number): Observable<BiasSummaryResponse> => {
    return this.httpService.post<BiasSummaryResponse>('/api/collector/v1/bias-analyses/'+ id+'/summary', {});
  }
}

//=============================================================================
