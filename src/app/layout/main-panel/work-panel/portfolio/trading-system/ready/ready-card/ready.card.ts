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
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
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
  selector    :     'ready-card',
  templateUrl :   './ready.card.html',
  styleUrls   : [ './ready.card.scss' ],
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatCardModule, MatMenuModule],
  standalone  : true
})

//=============================================================================

export class ReadyCard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

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
    super(eventBusService, labelService, router, "portfolio.tradingSystem.ready");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
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
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onTradingClick() {
    let value = ""+ !this.ts.running
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

  onMenuToTrading() {
    this.portfolioService.setTradingSystemTrading(this.ts.id, true).subscribe( res => {
      if (res.status == TspResponseStatus.OK) {
        this.emitToApp(new AppEvent<any>(AppEvent.TRADINGSYSTEM_LIST_RELOAD))
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("error.toTrading")+" : "+ res.message
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
}

//=============================================================================
