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
  DataInstrumentFull,
  DataProductExt,
  ConnectionSpec,
  Connection,
  DataProductSpec,
  DataProduct, DataInstrumentExt
} from "../model/model";
import {HttpService, UploadEvent} from "./http.service";
import {HttpParams} from "@angular/common/http";
import {
  BiasAnalysis, BiasBacktestRequest,
  BiasBacktestResponse,
  BiasConfig,
  BiasSummaryResponse
} from "../layout/main-panel/work-panel/tool/bias-analysis/model";

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

  public getDataInstrumentById = (id:number, details: boolean): Observable<DataInstrumentExt> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<DataInstrumentExt>('/api/collector/v1/data-instruments/'+ id, { params: params });
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

  public getBiasAnalyses = (details: boolean): Observable<ListResponse<BiasAnalysis>> => {
    let params = new HttpParams()
    params = params.set("details", details)
    return this.httpService.get<ListResponse<BiasAnalysis>>('/api/collector/v1/bias-analyses', { params: params });
  }

  //---------------------------------------------------------------------------

  // public getBiasAnalysisById = (id:number, details: boolean): Observable<BiasAnalysisExt> => {
  //   let params = new HttpParams()
  //   params = params.set("details", details)
  //   return this.httpService.get<BiasAnalysisExt>('/api/collector/v1/bias-analyses/'+ id, { params: params });
  // }

  //---------------------------------------------------------------------------

  public addBiasAnalysis = (ba : BiasAnalysis): Observable<BiasAnalysis> => {
    return this.httpService.post<BiasAnalysis>('/api/collector/v1/bias-analyses', ba);
  }

  //---------------------------------------------------------------------------

  public updateBiasAnalysis = (ba : BiasAnalysis): Observable<BiasAnalysis> => {
    return this.httpService.put<BiasAnalysis>('/api/collector/v1/bias-analyses/'+ba.id, ba);
  }

  //---------------------------------------------------------------------------

  public deleteBiasAnalysis = (id:number): Observable<BiasAnalysis> => {
    return this.httpService.delete<BiasAnalysis>('/api/collector/v1/bias-analyses/'+ id);
  }

  //---------------------------------------------------------------------------

  public getBiasSummary = (id:number): Observable<BiasSummaryResponse> => {
    return this.httpService.get<BiasSummaryResponse>('/api/collector/v1/bias-analyses/'+ id+'/summary', {});
  }

  //---------------------------------------------------------------------------
  //--- Configs

  public getBiasConfigsByAnalysisId = (id: number): Observable<ListResponse<BiasConfig>> => {
    return this.httpService.get<ListResponse<BiasConfig>>('/api/collector/v1/bias-analyses/'+ id+'/configs', {});
  }

  //---------------------------------------------------------------------------

  public addBiasConfig = (baId: number, bc : BiasConfig): Observable<BiasConfig> => {
    return this.httpService.post<BiasConfig>('/api/collector/v1/bias-analyses/'+ baId+'/configs', bc);
  }

  //---------------------------------------------------------------------------

  public updateBiasConfig = (baId: number, bc : BiasConfig): Observable<BiasConfig> => {
    return this.httpService.put<BiasConfig>('/api/collector/v1/bias-analyses/'+ baId+'/configs/'+ bc.id, bc);
  }

  //---------------------------------------------------------------------------

  public deleteBiasConfig = (baId: number, id : number): Observable<boolean> => {
    return this.httpService.delete<boolean>('/api/collector/v1/bias-analyses/'+ baId+'/configs/'+ id);
  }

  //---------------------------------------------------------------------------

  public runBacktest = (baId: number, req:BiasBacktestRequest): Observable<BiasBacktestResponse> => {
    return this.httpService.post<BiasBacktestResponse>('/api/collector/v1/bias-analyses/'+ baId+'/backtest', req);
  }
}

//=============================================================================
