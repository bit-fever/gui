//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {LabelService} from "../../../../../service/label.service";
import {EventBusService} from "../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {StorageService} from "../../../../../service/storage.service";
import { MatButtonToggleModule} from "@angular/material/button-toggle";
import {Setting} from "../../../../../model/setting";
import {TradingPanel} from "./trading/trading.panel";
import {ReadyPanel} from "./ready/ready.panel";
import {DevelopmentPanel} from "./development/development.panel";

//=============================================================================

@Component({
  selector    :     'portfolio-trading-system-db',
  templateUrl :   './trading-system.dashboard.html',
  styleUrls   : [ './trading-system.dashboard.scss' ],
  imports: [MatButtonToggleModule, ReactiveFormsModule, TradingPanel, NgIf, ReadyPanel, DevelopmentPanel],
  standalone  : true
})

//=============================================================================

export class TradingSystemDashboard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  selScope = new FormControl("DV")

  @ViewChild("developPanel") developPanel? : DevelopmentPanel
  @ViewChild("readyPanel")   readyPanel?   : ReadyPanel
  @ViewChild("tradingPanel") tradingPanel? : TradingPanel

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router,
              private storageService  : StorageService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.selScope.setValue(this.storageService.getItemWithDefault(Setting.Portfolio_TradSys_Scope, "TR"))
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  public scope(code : string) : string {
    return this.map("scope", code)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onScopeSet() {
    let value = this.selScope.value
    this.storageService.setItem(Setting.Portfolio_TradSys_Scope, value)
  }
}

//=============================================================================
