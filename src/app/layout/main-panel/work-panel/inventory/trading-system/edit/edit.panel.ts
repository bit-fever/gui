//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {RightTitlePanel} from "../../../../../../component/panel/right-title/right-title.panel";
import {AbstractPanel}   from "../../../../../../component/abstract.panel";
import {AppEvent} from "../../../../../../model/event";
import {LabelService} from "../../../../../../service/label.service";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {InputTextRequired} from "../../../../../../component/form/input-text-required/input-text-required";
import {
  Portfolio,
  BrokerProduct, DataProduct,
  TradingSession,
  TradingSystemSpec
} from "../../../../../../model/model";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {InventoryService} from "../../../../../../service/inventory.service";

//=============================================================================

@Component({
  selector    :     "tradingSystem-edit",
  templateUrl :   './edit.panel.html',
  styleUrls   : [ './edit.panel.scss' ],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, NgForOf, //NgModel,
            MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule,
            MatDividerModule, InputTextRequired, SelectTextRequired
  ],
  standalone  : true
})

//=============================================================================

export class TradingSystemEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ts = new TradingSystemSpec()
  portfolios : Portfolio     [] = []
  data       : DataProduct   [] = []
  brokers    : BrokerProduct [] = []
  sessions   : TradingSession[] = []

  @ViewChild("tsNameCtrl")      tsNameCtrl?      : InputTextRequired
  @ViewChild("tsStrategyCtrl")  tsStrategyCtrl?  : InputTextRequired
  @ViewChild("tsPortfolioCtrl") tsPortfolioCtrl? : SelectTextRequired
  @ViewChild("tsDataCtrl")      tsDataCtrl?      : SelectTextRequired
  @ViewChild("tsBrokerCtrl")    tsBrokerCtrl?    : SelectTextRequired
  @ViewChild("tsSessionCtrl")   tsSessionCtrl?   : SelectTextRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.tradingSystem");
    super.subscribeToApp(AppEvent.TRADINGSYSTEM_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getPortfolios().subscribe(
      result => {
        this.portfolios = result.result;
    })

    inventoryService.getDataProducts(false).subscribe(
      result => {
        this.data = result.result;
      })

    inventoryService.getBrokerProducts(false).subscribe(
      result => {
        this.brokers = result.result;
      })

    inventoryService.getTradingSessions().subscribe(
      result => {
        this.sessions = result.result;
      })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("TradingSystemEditPanel: Starting...");

    this.ts = event.params

    if (this.ts == undefined) {
      this.ts = new TradingSystemSpec()
    }
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.tsNameCtrl     ?.isValid() &&
            this.tsStrategyCtrl ?.isValid() &&
            this.tsPortfolioCtrl?.isValid() &&
            this.tsDataCtrl     ?.isValid() &&
            this.tsBrokerCtrl   ?.isValid() &&
            this.tsSessionCtrl  ?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("TradingSystem is : \n"+ JSON.stringify(this.ts));

    if (this.ts.id == undefined) {
      this.inventoryService.addTradingSystem(this.ts).subscribe( c => {
        this.onClose();
        this.emitToApp(new AppEvent<any>(AppEvent.TRADINGSYSTEM_LIST_RELOAD))
      })
    }
    else {
      this.inventoryService.updateTradingSystem(this.ts).subscribe( c => {
        this.onClose();
        this.emitToApp(new AppEvent<any>(AppEvent.TRADINGSYSTEM_LIST_RELOAD))
      })
    }
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
