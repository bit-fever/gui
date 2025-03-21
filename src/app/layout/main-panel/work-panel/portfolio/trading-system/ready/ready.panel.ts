//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {StorageService} from "../../../../../../service/storage.service";
import {TradingCard} from "../trading/trading-card/trading.card";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {PorTradingSystem, TsScope} from "../../../../../../model/model";
import {PortfolioService} from "../../../../../../service/portfolio.service";

//=============================================================================

@Component({
  selector    :     'ready-panel',
  templateUrl :   './ready.panel.html',
  styleUrls   : [ './ready.panel.scss' ],
  imports: [CommonModule, RouterModule, MatTabsModule, ReactiveFormsModule, FormsModule, TradingCard, MatFormField, MatIcon, MatIconButton, MatInput, MatLabel, MatSuffix, MatButton],
  standalone  : true
})

//=============================================================================

export class ReadyPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  _filter = ""

  tradingSystems : PorTradingSystem[] = []

  private tradingSystemsOrig : PorTradingSystem[] = []

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router,
              private snackBar        : MatSnackBar,
              private portfolioService: PortfolioService,
              private storageService  : StorageService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.reload()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
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

  reload() {
    this.tradingSystemsOrig = []
    this.tradingSystems     = []

    this.portfolioService.getTradingSystems().subscribe( res => {
      this.tradingSystemsOrig = res.result
      this.rebuildTSList()
    });
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
    this.tradingSystems = this.tradingSystemsOrig.filter(ts => {
      return (ts.scope == TsScope.Ready && this.runFilter(ts))
    })
  }

  //-------------------------------------------------------------------------
  //--- Filtering
  //-------------------------------------------------------------------------

  private runFilter = (ts : PorTradingSystem) : boolean => {
    return this.filterText(ts, this._filter)
  }

  //-------------------------------------------------------------------------

  private filterText(ts : PorTradingSystem, filter : string) : boolean {
    let name = ts.name?.trim().toLowerCase()
    if (name?.length == 0) {
      return true
    }

    return name?.indexOf(filter) != -1
  }
}

//=============================================================================
