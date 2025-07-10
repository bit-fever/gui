//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {PerformanceSummaryPanel} from "./summary/summary.panel";
import {PerformanceChartPanel} from "./chart/chart.panel";
import {PerformanceTradePanel} from "./trade/trade.panel";
import {AbstractPanel} from "../../component/abstract.panel";
import {PerformanceAnalysisRequest, PerformanceAnalysisResponse} from "../../model/model";
import {EventBusService} from "../../service/eventbus.service";
import {LabelService} from "../../service/label.service";
import {InventoryService} from "../../service/inventory.service";
import {PortfolioService} from "../../service/portfolio.service";
import {LocalService} from "../../service/local.service";
import {AppEvent} from "../../model/event";
import {Setting} from "../../model/setting";
import {SelectRequired} from "../../component/form/select-required/select-required";
import {RightTitlePanel} from "../../component/panel/right-title/right-title.panel";
import {BroadcastEvent, BroadcastService, EventType} from "../../service/broadcast.service";
import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";

//=============================================================================

@Component({
    selector: "tradingSystem-performance",
    templateUrl: './performance.panel.html',
    styleUrls: ['./performance.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, MatButtonToggleModule, MatIconModule, PerformanceSummaryPanel, PerformanceChartPanel, PerformanceTradePanel, NgIf, SelectRequired, RightTitlePanel, ModuleTitlePanel,
  ]
})

//=============================================================================

export class TradingSystemPerformancePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  selectedPeriod : number = 180
  timezone       : string = "exchange"

  periods        : any
  timezones      : any

  selTab = new FormControl("summary")

  tsId : number = 0
  par: PerformanceAnalysisResponse = new PerformanceAnalysisResponse()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private inventoryService : InventoryService,
              private portfolioService : PortfolioService,
              private localService     : LocalService,
              private broadcastService : BroadcastService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem.performance", "tradingSystem");

    broadcastService.onEvent((e : BroadcastEvent)=>{
      if (e.type == EventType.TradingsSystem_Deleted) {
        window.close()
      }
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.selectedPeriod = Number(this.localService.getItemWithDefault(Setting.Portfolio_TradSys_PerfPeriod, "180"))
    this.selTab.setValue(this.localService.getItemWithDefault(Setting.Portfolio_TradSys_PerfTab, "summary"))

    this.inventoryService.getExchanges().subscribe(
      result => {
        let exchange = {
          timezone : "exchange",
          code     : this.loc("exchange")
        }

        this.timezones = [ exchange, ...result.result]
      }
    )

    this.periods = this.labelMap("periods");
    this.tsId    = Number(this.route.snapshot.paramMap.get("id"));
    this.reload()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(value: string) {
    this.localService.setItem(Setting.Portfolio_TradSys_PerfPeriod, value)
    this.reload();
  }

  //-------------------------------------------------------------------------

  onTimezoneChange(value: string) {
    this.reload()
  }

  //-------------------------------------------------------------------------

  onTabSet() {
    let value = this.selTab.value
    this.localService.setItem(Setting.Portfolio_TradSys_PerfTab, value)
  }

  //-------------------------------------------------------------------------

  onReloadClick() {
    this.reload();
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    window.close()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private reload() {
    if (this.tsId == 0) {
      return
    }

    console.log("Reloading with: tsId="+this.tsId+", daysBack="+ this.selectedPeriod+", timezone="+ this.timezone)

    let req : PerformanceAnalysisRequest = {
      daysBack : this.selectedPeriod,
      timezone : this.timezone,
    }

    this.portfolioService.getPerformanceAnalysis(this.tsId, req).subscribe(res => {
      this.par = res
    })
  }
}

//=============================================================================
