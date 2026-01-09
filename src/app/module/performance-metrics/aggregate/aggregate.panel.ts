//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {AbstractPanel} from "../../../component/abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {FlexTablePanel} from "../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../model/flex-table";
import { NumericClassStyler} from "../../../component/panel/flex-table/icon-sylers";
import {AnnualAggregate, PerformanceAnalysisResponse} from "../../../model/performance";

//=============================================================================

@Component({
  selector: 'performance-aggregate-panel',
  templateUrl: './aggregate.panel.html',
  styleUrls: ['./aggregate.panel.scss'],
  imports: [
    FlexTablePanel
  ]
})

//=============================================================================

export class PerformanceAggregatePanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  annualColumns    : FlexTableColumn[] = []
  annualAggregates : AnnualAggregate[] = []

  //---------------------------------------------------------------------------

  @Input()
  set par(par : PerformanceAnalysisResponse) {
    this._par = par

    if (par.aggregates?.annual) {
      this.annualAggregates = par.aggregates?.annual
    }
  }

  get par() : PerformanceAnalysisResponse|undefined {
    return this._par
  }

  _par? : PerformanceAnalysisResponse

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router) {
    super(eventBusService, labelService, router, "module.performance.aggregate", "")
  }

  //---------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //---------------------------------------------------------------------------

  //---------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //---------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.annualAggregate");

    this.annualColumns = [
      new FlexTableColumn(ts, "year"),
      new FlexTableColumn(ts, "trades"),
      new FlexTableColumn(ts, "grossProfit",   undefined, undefined, new NumericClassStyler()),
      new FlexTableColumn(ts, "netProfit",     undefined, undefined, new NumericClassStyler()),
      new FlexTableColumn(ts, "grossAvgTrade", undefined, undefined, new NumericClassStyler()),
      new FlexTableColumn(ts, "netAvgTrade",   undefined, undefined, new NumericClassStyler()),
      new FlexTableColumn(ts, "grossWinPerc"),
      new FlexTableColumn(ts, "netWinPerc"),
    ]
  }
}

//=============================================================================
