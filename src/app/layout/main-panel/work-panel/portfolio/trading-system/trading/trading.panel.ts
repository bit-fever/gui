//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {Router, RouterModule} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {TradingCard} from "./trading-card/trading.card";
import {PorTradingSystem} from "../../../../../../model/model";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {LocalService} from "../../../../../../service/local.service";
import {Setting} from "../../../../../../model/setting";
import {AppEvent} from "../../../../../../model/event";

//=============================================================================

@Component({
    selector: 'trading-panel',
    templateUrl: './trading.panel.html',
    styleUrls: ['./trading.panel.scss'],
    imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
        RouterModule, MatTabsModule, ReactiveFormsModule, MatButtonToggle, MatButtonToggleGroup, TradingCard, FormsModule]
})

//=============================================================================

export class TradingPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  _filter = ""

  selRunning   = new FormControl("*")
  selActive    = new FormControl("*")
  selActivation= new FormControl("*")

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
              private storageService  : LocalService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem.trading");

    eventBusService.subscribeToApp(AppEvent.TRADINGSYSTEM_LIST_RELOAD, () => {
      this.reload()
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupSettings()
    this.reload()
  }

  //-------------------------------------------------------------------------

  private setupSettings = () => {
    this.selRunning   .setValue(this.storageService.getItemWithDefault(Setting.Portfolio_TradSys_Running   , "*"))
    this.selActive    .setValue(this.storageService.getItemWithDefault(Setting.Portfolio_TradSys_Active    , "*"))
    this.selActivation.setValue(this.storageService.getItemWithDefault(Setting.Portfolio_TradSys_Activation, "*"))
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

  onFlagRunningChange() {
    let value = this.selRunning.value
    this.storageService.setItem(Setting.Portfolio_TradSys_Running, value)
    this.rebuildTSList()
  }

  //-------------------------------------------------------------------------

  onFlagActiveChange() {
    let value = this.selActive.value
    this.storageService.setItem(Setting.Portfolio_TradSys_Active, value)
    this.rebuildTSList()
  }

  //-------------------------------------------------------------------------

  onFlagActivationChange() {
    let value = this.selActivation.value
    this.storageService.setItem(Setting.Portfolio_TradSys_Activation, value)
    this.rebuildTSList()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private rebuildTSList() {
    this.tradingSystems = this.tradingSystemsOrig.filter(ts => {
      return (ts.finalized && ts.trading && this.runFilter(ts))
    })
  }

  //-------------------------------------------------------------------------
  //--- Filtering
  //-------------------------------------------------------------------------

  private runFilter = (ts : PorTradingSystem) : boolean => {
    let text= this.filterText(ts, this._filter)

    let trading = this.filterRunning(ts.running) && this.filterActive(ts.active) && this.filterActivation(ts.autoActivation)
    if (!trading) {
      return false
    }

    return text
  }

  //-------------------------------------------------------------------------

  private filterText(ts : PorTradingSystem, filter : string) : boolean {
    let name = ts.name?.trim().toLowerCase()
    if (name?.length == 0) {
      return true
    }

    return name?.indexOf(filter) != -1
  }

  //-------------------------------------------------------------------------

  private filterRunning(running : boolean) : boolean {
    let value = this.selRunning.value

    if (value == "*") {
      return true
    }
    return (value == "r" && running) || (value == "s" && !running)
  }

  //-------------------------------------------------------------------------

  private filterActive(active : boolean) : boolean {
    let value = this.selActive.value

    if (value == "*") {
      return true
    }
    return (value == "a" && active) || (value == "i" && !active)
  }

  //-------------------------------------------------------------------------

  private filterActivation(activation : boolean) : boolean {
    let value = this.selActivation.value

    if (value == "*") {
      return true
    }
    return (value == "m" && !activation) || (value == "a" && activation)
  }
}

//=============================================================================
