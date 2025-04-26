//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {RightTitlePanel} from "../../../../../../component/panel/right-title/right-title.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {PorTradingSystem, TradingSystemSpec} from "../../../../../../model/model";
import {AppEvent} from "../../../../../../model/event";

//=============================================================================

@Component({
    selector: "tradingSystem-performance",
    templateUrl: './performance.panel.html',
    styleUrls: ['./performance.panel.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule,
        MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
        MatDividerModule,
    ]
})

//=============================================================================

export class TradingSystemPerformancePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ts = new PorTradingSystem()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private portfolioService : PortfolioService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem.performance", "tradingSystem");
    super.subscribeToApp(AppEvent.TRADINGSYSTEM_EDIT_START, (e : AppEvent) => this.onStart(e));
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("TradingSystemPerformancePanel: Starting...");

    if (event.params == undefined) {
      this.ts = new PorTradingSystem()
    }
    else {
      this.ts = Object.assign(new PorTradingSystem(), event.params)
    }
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    this.ts = new PorTradingSystem()
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
