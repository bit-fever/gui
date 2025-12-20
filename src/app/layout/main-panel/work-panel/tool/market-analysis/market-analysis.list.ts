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
import {DataProductSelector} from "../../../../../component/form/data-product-selector/product-selector.panel";
import {SelectRequired} from "../../../../../component/form/select-required/select-required";
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../service/eventbus.service";
import {LabelService} from "../../../../../service/label.service";

//=============================================================================

@Component({
  selector: "tradingSystem-devel-edit",
  templateUrl: './edit.panel.html',
  styleUrls: ['./edit.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, SelectRequired, MatSlideToggle, DataProductSelector
  ]
})

//=============================================================================

export class MarketAnalysisListPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  dataProductId? : number

  @ViewChild("tsDataCtrl") tsDataCtrl? : DataProductSelector

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private collectorService : CollectorService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem.development", "tradingSystem");
    super.subscribeToApp(AppEvent.TRADINGSYSTEM_DEVEL_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getAgentProfiles().subscribe(
      result => {
        let empty = new AgentProfile()

        this.profiles = [empty, ...result.result];
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

    this.strategyTypes  = this.labelService.getLabel("map.strategyType")
    this.engineCodes    = this.labelService.getLabel("map.engineCode")

    if (event.params == undefined) {
      this.ts = new TradingSystemSpec()
      this.title = this.loc('new')
    }
    else {
      this.ts = Object.assign(new TradingSystemSpec(), event.params)
      this.title = this.loc('edit')
    }
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    let agent = true

    if (this.ts.agentProfileId && this.tsExternRefCtrl) {
      agent = this.tsExternRefCtrl?.isValid()
    }

    return  this.tsNameCtrl     ?.isValid() &&
      this.tsDataCtrl     ?.isValid() &&
      this.tsBrokerCtrl   ?.isValid() &&
      this.tsSessionCtrl  ?.isValid() &&
      this.tsTimeframeCtrl?.isValid() &&
      this.tsStratTypeCtrl?.isValid() &&
      agent
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("TradingSystem is : \n"+ JSON.stringify(this.ts));

    this.ts.tags = this.tagSet.join("|")
    if (this.ts.id == undefined) {
      this.inventoryService.addTradingSystem(this.ts).subscribe( c => {
        this.onClose();
        this.emitToApp(new AppEvent<any>(AppEvent.TRADINGSYSTEM_DEVEL_LIST_RELOAD))
      })
    }
    else {
      this.inventoryService.updateTradingSystem(this.ts).subscribe( c => {
        this.onClose();
        this.emitToApp(new AppEvent<any>(AppEvent.TRADINGSYSTEM_DEVEL_LIST_RELOAD))
      })
    }
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    this.ts = new TradingSystemSpec()
    this.title = ""

    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
