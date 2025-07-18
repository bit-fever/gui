//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {NgForOf} from "@angular/common";
import {AbstractPanel} from "../../../component/abstract.panel";
import {PerformanceAnalysisResponse} from "../../../model/model";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";

//=============================================================================

@Component({
  selector: 'performance-summary-panel',
  templateUrl: './summary.panel.html',
  styleUrls: ['./summary.panel.scss'],
  imports: [
    NgForOf
  ]
})

//=============================================================================

export class PerformanceSummaryPanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  @Input()
  set par(par : PerformanceAnalysisResponse) {
    this._par = par
    this.buildSummary(par)
  }

  get par() : PerformanceAnalysisResponse|undefined {
    return this._par
  }

  _par? : PerformanceAnalysisResponse

  summary : SummaryRow[] = []

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router) {
    super(eventBusService, labelService, router, "module.performance.summary", "")
  }

  //---------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //---------------------------------------------------------------------------

  //---------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //---------------------------------------------------------------------------

  private buildSummary(par : PerformanceAnalysisResponse) {
    this.summary = <SummaryRow[]>[
      new SummaryRow( this.loc('profit'),
                      par.gross?.profit?.total, par.gross?.profit?.long, par.gross?.profit?.short,
                      par.net  ?.profit?.total, par.net  ?.profit?.long, par.net  ?.profit?.short),

      new SummaryRow( this.loc('maxDD'),
                      par.gross?.maxDrawdown?.total, par.gross?.maxDrawdown?.long, par.gross?.maxDrawdown?.short,
                      par.net  ?.maxDrawdown?.total, par.net  ?.maxDrawdown?.long, par.net  ?.maxDrawdown?.short),

      new SummaryRow( this.loc('avgTrade'),
                      par.gross?.averageTrade?.total, par.gross?.averageTrade?.long, par.gross?.averageTrade?.short,
                      par.net  ?.averageTrade?.total, par.net  ?.averageTrade?.long, par.net  ?.averageTrade?.short),
    ]
  }
}

//=============================================================================

class SummaryRow {
  constructor(public text?       : string,
              public grossTotal? : number,
              public grossLong?  : number,
              public grossShort? : number,
              public netTotal?   : number,
              public netLong?    : number,
              public netShort?   : number) {
  }
  //---------------------------------------------------------------------------

  grossTotStyle = () : string => { return this.isNeg(this.grossTotal) ? "red-style" : "" }
  grossLonStyle = () : string => { return this.isNeg(this.grossLong)  ? "red-style" : "" }
  grossShoStyle = () : string => { return this.isNeg(this.grossShort) ? "red-style" : "" }
  netTotStyle   = () : string => { return this.isNeg(this.netTotal)   ? "red-style" : "" }
  netLonStyle   = () : string => { return this.isNeg(this.netLong)    ? "red-style" : "" }
  netShoStyle   = () : string => { return this.isNeg(this.netShort)   ? "red-style" : "" }

  private isNeg = (value? :number) : boolean => {
    return !(value == undefined || value >= 0);
  }
}

//=============================================================================
