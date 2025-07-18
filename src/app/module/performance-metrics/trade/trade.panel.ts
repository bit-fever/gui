//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput, MatLabel} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {AbstractPanel} from "../../../component/abstract.panel";
import {PerformanceAnalysisResponse, Trade} from "../../../model/model";
import {FlexTableColumn} from "../../../model/flex-table";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {DataPointTimeTranscoder} from "../../../component/panel/flex-table/transcoders";
import {FlexTablePanel} from "../../../component/panel/flex-table/flex-table.panel";

//=============================================================================

@Component({
  selector: 'performance-trade-panel',
  templateUrl: './trade.panel.html',
  styleUrls: ['./trade.panel.scss'],
  imports: [
    FlexTablePanel,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule
  ]
})

//=============================================================================

export class PerformanceTradePanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  _par? : PerformanceAnalysisResponse
  _filter = ""

  //---------------------------------------------------------------------------

  columns : FlexTableColumn[] = [];
  trades  : Trade          [] = []

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router) {
    super(eventBusService, labelService, router, "module.performance.trades", "")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.trade");

    this.columns = [
      new FlexTableColumn(ts, "entryDate", new DataPointTimeTranscoder()),
      new FlexTableColumn(ts, "entryPrice"),
      new FlexTableColumn(ts, "entryLabel"),
      new FlexTableColumn(ts, "exitDate", new DataPointTimeTranscoder()),
      new FlexTableColumn(ts, "exitPrice"),
      new FlexTableColumn(ts, "exitLabel"),
      new FlexTableColumn(ts, "tradeType"),
      new FlexTableColumn(ts, "grossProfit"),
      new FlexTableColumn(ts, "contracts"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  get par() : PerformanceAnalysisResponse|undefined {
    return this._par
  }

  //-------------------------------------------------------------------------

  @Input()
  set par(par : PerformanceAnalysisResponse) {
    this._par = par
    this.rebuildTSList()
  }

  //-------------------------------------------------------------------------

  get filter() : string {
    return this._filter
  }

  //-------------------------------------------------------------------------

  @Input()
  set filter(value : string) {
    this._filter = value
    this.rebuildTSList()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private rebuildTSList() {
    this.trades = []

    if (this.par != undefined) {
      this.trades = this.par.trades.filter(ts => {
        return (this.runFilter(ts))
      })
    }
  }

  //-------------------------------------------------------------------------
  //--- Filtering
  //-------------------------------------------------------------------------

  private runFilter = (tr : Trade) : boolean => {
    return this.filterStrings(tr, this._filter)
  }

  //-------------------------------------------------------------------------

  private filterStrings(tr : Trade, filter : string) : boolean {
    let text = JSON.stringify(tr)
    return this.filterText(filter, text)
  }

  //-------------------------------------------------------------------------

  private filterText(filter : string, text?:string) : boolean {
    let value = (text != undefined)
                        ? text.trim().toLowerCase()
                        : ""

    if (value.length == 0) {
      return true
    }

    return value.indexOf(filter) != -1
  }
}

//=============================================================================
