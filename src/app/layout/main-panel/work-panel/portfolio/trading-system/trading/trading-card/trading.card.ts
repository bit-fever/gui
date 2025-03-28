//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {CheckButton} from "../../../../../../../component/form/check-button/check-button";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {TradingSystemStatusStyler} from "../../../../../../../component/panel/flex-table/transcoders";
import {CheckButtonConfig} from "../../../../../../../component/form/check-button/check-button-config";
import {PorTradingSystem, TspResponseStatus} from "../../../../../../../model/model";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {PortfolioService} from "../../../../../../../service/portfolio.service";
import {Url} from "../../../../../../../model/urls";
import {AppEvent} from "../../../../../../../model/event";
import {InventoryService} from "../../../../../../../service/inventory.service";

//=============================================================================

const LABEL_ROOT = "page.portfolio.tradingSystem.trading.buttons"

//=============================================================================

@Component({
  selector    :     'trading-card',
  templateUrl :   './trading.card.html',
  styleUrls   : [ './trading.card.scss' ],
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, CheckButton, MatCardModule, MatMenuModule],
  standalone  : true
})

//=============================================================================

export class TradingCard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  statusStyler = new TradingSystemStatusStyler()
  suggActions : Object[] = []

  powerConfig = new CheckButtonConfig("mode_off_on",                 "off",      "#A0A0A0", "mode_off_on", "on",     "#00A000", LABEL_ROOT)
  activConfig = new CheckButtonConfig("airline_seat_recline_normal", "manual",   "#A00080", "mode_off_on", "auto",   "#0080C0", LABEL_ROOT)
  enablConfig = new CheckButtonConfig("toggle_off",                  "inactive", "#A0A0A0", "toggle_on",   "active", "#00A000", LABEL_ROOT)

  @Input("tradingSystem") ts : PorTradingSystem = new PorTradingSystem()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private snackBar        : MatSnackBar,
              private inventoryService: InventoryService,
              private portfolioService: PortfolioService,
              ) {
    super(eventBusService, labelService, router, "portfolio.tradingSystem.trading");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.suggActions = this.labelService.getLabel("map.suggestedAction")
  }

  //-------------------------------------------------------------------------

  marketTypeIcon() : string {
    switch (this.ts.marketType) {
      case "IN" : return "bar_chart_4_bars"
      case "EN" : return "local_fire_department"
      case "ME" : return "diamond"
      case "GR" : return "local_florist"
      case "BO" : return "savings"
      case "MT" : return "lunch_dining"
      case "FX" : return "currency_exchange"
    }

    return "???"
  }

  //-------------------------------------------------------------------------

  valueColor(value : number|undefined) : string {
    if (value == undefined || value == 0) {
      return "#000000"
    }

    return (value > 0) ? "#10A010" : "#A01010"
  }

  //-------------------------------------------------------------------------

  suggAction(id : number|undefined) : any {
    // @ts-ignore
    return this.suggActions[id]
  }

  //-------------------------------------------------------------------------

  statusIcon(status : number|undefined) : string|undefined {
    return (status != undefined) ? this.statusStyler.getStyle(status, null).icon : ""
  }

  //-------------------------------------------------------------------------

  statusColor(status : number|undefined) : string|undefined {
    return (status != undefined) ? this.statusStyler.getStyle(status, null).color : ""
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPowerClick() {
    this.portfolioService.setTradingSystemRunning(this.ts.id, !this.ts.running).subscribe( res => {
      if (res.status == TspResponseStatus.OK) {
        this.refresh(res.tradingSystem)
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("error.running")+" : "+ res.message
        this.snackBar.open(message, this.button("ok"))
      }
    })
  }

  //-------------------------------------------------------------------------

  onActivationClick() {
    this.portfolioService.setTradingSystemActivation(this.ts.id, !this.ts.autoActivation).subscribe( res => {
      if (res.status == TspResponseStatus.OK) {
        this.refresh(res.tradingSystem)
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("error.activation")+" : "+ res.message
        this.snackBar.open(message, this.button("ok"))
      }
    })
  }

  //-------------------------------------------------------------------------

  onActiveClick() {
    this.portfolioService.setTradingSystemActive(this.ts.id, !this.ts.active).subscribe( res => {
      if (res.status == TspResponseStatus.OK) {
        this.refresh(res.tradingSystem)
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("error.active")+" : "+ res.message
        this.snackBar.open(message, this.button("ok"))
      }
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Menu events
  //---
  //-------------------------------------------------------------------------

  onMenuFilter() {
      this.navigateTo([ Url.Portfolio_TradingSystems, this.ts.id, Url.Sub_Filtering ]);
  }

  //-------------------------------------------------------------------------

  onMenuToReady() {
    this.portfolioService.setTradingSystemTrading(this.ts.id, false).subscribe( res => {
      if (res.status == TspResponseStatus.OK) {
        this.emitToApp(new AppEvent<any>(AppEvent.TRADINGSYSTEM_LIST_RELOAD))
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("error.toReady")+" : "+ res.message
        this.snackBar.open(message, this.button("ok"))
      }
    })
  }

  //-------------------------------------------------------------------------

  onMenuDelete() {
    this.inventoryService.deleteTradingSystem(this.ts.id).subscribe( res => {
      this.emitToApp(new AppEvent<any>(AppEvent.TRADINGSYSTEM_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private refresh(ts : PorTradingSystem|undefined) {
    if (ts == undefined) {
      return
    }

    this.ts.running         = ts.running
    this.ts.autoActivation  = ts.autoActivation
    this.ts.active          = ts.active
    this.ts.status          = ts.status
    this.ts.suggestedAction = ts.suggestedAction
  }
}

//=============================================================================
