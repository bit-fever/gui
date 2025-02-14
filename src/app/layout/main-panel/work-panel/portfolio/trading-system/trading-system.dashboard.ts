//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {PorTradingSystem, TradingSystemProperty, TspResponseStatus} from "../../../../../model/model";
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {LabelService} from "../../../../../service/label.service";
import {EventBusService} from "../../../../../service/eventbus.service";
import {TradingSystemStatusStyler} from "../../../../../component/panel/flex-table/transcoders";
import {Router, RouterModule} from "@angular/router";
import {PortfolioService} from "../../../../../service/portfolio.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ReactiveFormsModule} from "@angular/forms";
import {StorageService} from "../../../../../service/storage.service";
import {MatTabsModule} from "@angular/material/tabs";
import {CheckButton} from "../../../../../component/form/check-button/check-button";
import {CheckButtonConfig} from "../../../../../component/form/check-button/check-button-config";

//=============================================================================

const LABEL_ROOT = "page.portfolio.tradingSystem.buttons"

//=============================================================================

@Component({
  selector    :     'portfolio-trading-system-db',
  templateUrl :   './trading-system.dashboard.html',
  styleUrls   : [ './trading-system.dashboard.scss' ],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
    RouterModule, MatTabsModule, ReactiveFormsModule, CheckButton],
  standalone  : true
})

//=============================================================================

export class TradingSystemDashboard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  tradingSystems : PorTradingSystem[] = [];
  suggActions    : Object          [] = []

  statusStyler = new TradingSystemStatusStyler()

  powerConfig = new CheckButtonConfig("mode_off_on",                 "off",      "#A0A0A0", "mode_off_on", "on",     "#00A000", LABEL_ROOT)
  activConfig = new CheckButtonConfig("airline_seat_recline_normal", "manual",   "#A00080", "mode_off_on", "auto",   "#0080C0", LABEL_ROOT)
  enablConfig = new CheckButtonConfig("toggle_off",                  "inactive", "#A0A0A0", "toggle_on",   "active", "#00A000", LABEL_ROOT)

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
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.suggActions = this.labelService.getLabel("map.suggestedAction")
    this.portfolioService.getTradingSystems().subscribe( res => {
      this.tradingSystems = res.result
    });
  }

  //-------------------------------------------------------------------------

  marketTypeIcon(ts : PorTradingSystem) : string {
    switch (ts.marketType) {
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

  public scope(code : string) : string {
    return this.map("scope", code)
  }

  //-------------------------------------------------------------------------

  onPowerClick(ts: PorTradingSystem) {
    let value = ""+ !ts.running
    this.portfolioService.setTradingSystemProperty(ts.id, TradingSystemProperty.RUNNING, value).subscribe( res => {
      if (res.status == TspResponseStatus.OK) {
        let message = this.loc("message.runningOk")
        this.snackBar.open(message, undefined, { duration:2000 })
        ts.running = !ts.running
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("message.runningError")+" : "+ res.message
        this.snackBar.open(message, this.button("ok"))
      }
    })
  }

  //-------------------------------------------------------------------------

  onActivationClick(ts: PorTradingSystem) {
    let value = ""+ !ts.autoActivation
    this.portfolioService.setTradingSystemProperty(ts.id, TradingSystemProperty.ACTIVATION, value).subscribe( res => {
      if (res.status == TspResponseStatus.OK) {
        let message = this.loc("message.activationOk")
        this.snackBar.open(message, undefined, { duration:2000 })
        ts.autoActivation = !ts.autoActivation
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("message.activationError")+" : "+ res.message
        this.snackBar.open(message, this.button("ok"))
      }
    })
  }

  //-------------------------------------------------------------------------

  onActiveClick(ts: PorTradingSystem) {
    let value = ""+ !ts.active
    this.portfolioService.setTradingSystemProperty(ts.id, TradingSystemProperty.ACTIVE, value).subscribe( res => {
      if (res.status == TspResponseStatus.OK) {
        let message = this.loc("message.activeOk")
        this.snackBar.open(message, undefined, { duration:2000 })
        ts.active = !ts.active
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("message.activeError")+" : "+ res.message
        this.snackBar.open(message, this.button("ok"))
      }
    })
  }

  //-------------------------------------------------------------------------
  //--- Table filtering
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //--- Table filtering
  //-------------------------------------------------------------------------

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
