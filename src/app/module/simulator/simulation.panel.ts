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
import {SimulationRequest, SimulationResult} from "../../model/simulation";
import {SimulationParamsPanel} from "./params/params.panel";
import {SimulationWaitingPanel} from "./waiting/waiting.panel";
import {PorTradingSystem} from "../../model/model";
import {SimulationResultsPanel} from "./results/results.panel";
import {interval, Subscription} from "rxjs";

//=============================================================================

@Component({
  selector: "tradingSystem-simulation",
  templateUrl: './simulation.panel.html',
  styleUrls : ['./simulation.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, MatButtonToggleModule, MatIconModule, ModuleTitlePanel, SimulationParamsPanel, SimulationWaitingPanel, SimulationResultsPanel,
  ]
})

//=============================================================================

export class TradingSystemSimulationPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  tsId : number = 0

  ts   : PorTradingSystem  = new PorTradingSystem()
  req  : SimulationRequest = new SimulationRequest()
  res? : SimulationResult

  status = "idle"

  reloadInterval? : Subscription;

  private isRunning = true;

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
              private broadcastService : BroadcastService) {

    super(eventBusService, labelService, router, "module.simulation");

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
    console.log("TradingSystemSimulationPanel: Initializing...")

    this.tsId = Number(this.route.snapshot.paramMap.get("id"));

    this.portfolioService.getTradingSystem(this.tsId).subscribe(res => {
      this.ts = res
    })

    this.reloadInterval = interval(1000).subscribe(
      result => {
        if (this.isRunning) {
          this.reload()
        }
      }
    )
  }

  //-------------------------------------------------------------------------

  override destroy = () : void => {
    this.reloadInterval?.unsubscribe()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  public onRunClick(req : SimulationRequest) : void {
    console.log("Starting simulation for tsId="+ this.tsId +" with request:" +JSON.stringify(req));

    req.width  = window.innerWidth  -   2 //--- Real width: window's width
    req.height = window.innerHeight - 108 //--- Real height: window's height - 106

    this.portfolioService.startSimulation(this.tsId, req).subscribe(res => {
      this.isRunning = true
    })
  }

  //-------------------------------------------------------------------------

  public onStopClick() : void {
    console.log("Stopping simulation for tsId="+ this.tsId);

    this.portfolioService.stopSimulation(this.tsId).subscribe(res => {
      this.isRunning = true
    })
  }

  //-------------------------------------------------------------------------

  public onReRunClick() : void {
    console.log("Cleaning simulation for a rerun for tsId="+ this.tsId);
    this.portfolioService.stopSimulation(this.tsId).subscribe(res => {
      this.isRunning = true
    })
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
    console.log("Reloading simulation for tsId="+ this.tsId)

    this.portfolioService.getSimulationResult(this.tsId).subscribe(res => {
      this.res = res

      if (res.status) {
        this.status = res.status
        if (this.status == "complete" || this.status == "idle") {
          this.isRunning = false
        }
      }
    })
  }
}

//=============================================================================
