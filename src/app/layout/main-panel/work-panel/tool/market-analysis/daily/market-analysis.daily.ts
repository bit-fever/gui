//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {Router, RouterModule} from "@angular/router";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {DailyResult} from "../model";

//=============================================================================

@Component({
  selector: 'market-analysis-daily',
  templateUrl: './market-analysis.daily.html',
  styleUrls: [ './market-analysis.daily.scss'],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule,
    RouterModule, FlexTablePanel]
})

//=============================================================================

export class MarketAnalysisDailyPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns : FlexTableColumn[] = [];
  results : DailyResult[]     = [];

  @ViewChild("table") table : FlexTablePanel<DailyResult>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService  : EventBusService,
              labelService     : LabelService,
              router           : Router) {

    super(eventBusService, labelService, router, "tool.marketAnalysis");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.dailyResult");

    this.columns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "dataSymbol"),
      new FlexTableColumn(ts, "dataName"),
      new FlexTableColumn(ts, "brokerSymbol"),
      new FlexTableColumn(ts, "brokerName"),
    ]
  }

  //-------------------------------------------------------------------------

  reload(list : DailyResult[]) {
    console.log("Reloading daily results...")
    this.results = list;
  }
}

//=============================================================================
