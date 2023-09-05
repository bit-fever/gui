//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}      from "@angular/core";
import {Observable}      from "rxjs";
import {PortfolioTree}   from "../model/model";
import {HttpService}     from "./http.service";

//=============================================================================

@Injectable()
export class PortfolioService {

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

  public getPortfolioTree = (): Observable<PortfolioTree[]> => {
    return this.httpService.get<PortfolioTree[]>('/api/portfolio/v1/portfolio-tree');
  }
}

//=============================================================================
