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
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../component/abstract.panel";
import {EventBusService} from "../../service/eventbus.service";
import {LabelService} from "../../service/label.service";
import {PortfolioService} from "../../service/portfolio.service";
import {LocalService} from "../../service/local.service";
import {SelectRequired} from "../../component/form/select-required/select-required";
import {BroadcastEvent, BroadcastService, EventType} from "../../service/broadcast.service";
import {ModuleTitlePanel} from "../../component/panel/module-title/module-title.panel";
import {QualityMarketPanel} from "./market/market.panel";
import {QualityAnalysisRequest, QualityAnalysisResponse} from "../../model/quality";

//=============================================================================

@Component({
  selector: "tradingSystem-quality",
  templateUrl: './quality.panel.html',
  styleUrls : ['./quality.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, MatButtonToggleModule, MatIconModule, SelectRequired, ModuleTitlePanel, QualityMarketPanel,
  ]
})

//=============================================================================

export class TradingSystemQualityPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  selectedPeriod : number = 0

  periods : any

  selTab = new FormControl("market")

  tsId : number = 0
  qar  : QualityAnalysisResponse = new QualityAnalysisResponse()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private route            : ActivatedRoute,
              private portfolioService : PortfolioService,
              private localService     : LocalService,
              private broadcastService : BroadcastService) {

    super(eventBusService, labelService, router, "module.quality", "tradingSystem");

    broadcastService.onEvent((e : BroadcastEvent)=>{
      if (e.type == EventType.TradingsSystem_Deleted && e.id == this.tsId) {
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
    console.log("TradingSystemQualityPanel: Initializing...")

    this.periods = this.labelMap("periods");
    this.tsId    = Number(this.route.snapshot.paramMap.get("id"));

    //--- Reloading is implicitly triggered by the 2 select-required components
    //--- this.reload()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onPeriodChange(value: string) {
    console.log("Analysis period change : ", value)
    this.reload();
  }

  //-------------------------------------------------------------------------

  onTabSet() {
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

    console.log("Reloading with: tsId="+this.tsId+", daysBack="+ this.selectedPeriod)

    let req : QualityAnalysisRequest = {
      daysBack : this.selectedPeriod,
    }

    this.portfolioService.getQualityAnalysis(this.tsId, req).subscribe(res => {
      this.qar = res
    })
  }
}

//=============================================================================
