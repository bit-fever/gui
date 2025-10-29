//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
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
import {RightTitlePanel} from "../../../../../../../component/panel/right-title/right-title.panel";
import {InputTextRequired} from "../../../../../../../component/form/input-text-required/input-text-required";
import {SelectRequired} from "../../../../../../../component/form/select-required/select-required";
import {InputNumberRequired} from "../../../../../../../component/form/input-integer-required/input-number-required";
import {ChipSetTextComponent} from "../../../../../../../component/form/chip-text-set/chip-set-text";
import {SelectTextRequired} from "../../../../../../../component/form/select-optional/select-optional";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {
  AgentProfile,
  BrokerProduct,
  DataProduct,
  TradingSession,
  TradingSystemSpec
} from "../../../../../../../model/model";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {InventoryService} from "../../../../../../../service/inventory.service";
import {AppEvent} from "../../../../../../../model/event";
import {DataProductSelector} from "../../../../../../../component/form/data-product-selector/product-selector.panel";
import {
  BrokerProductSelector
} from "../../../../../../../component/form/broker-product-selector/product-selector.panel";
import {DatePicker} from "../../../../../../../component/form/date-picker/date-picker";

//=============================================================================

@Component({
    selector: "tradingSystem-devel-edit",
    templateUrl: './edit.panel.html',
    styleUrls: ['./edit.panel.scss'],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, InputTextRequired, SelectRequired, InputNumberRequired, ChipSetTextComponent, SelectTextRequired, MatSlideToggle, NgIf, DataProductSelector, BrokerProductSelector, DatePicker
  ]
})

//=============================================================================

export class TradingSystemDevelEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ts = new TradingSystemSpec()
  data          : DataProduct   [] = []
  brokers       : BrokerProduct [] = []
  sessions      : TradingSession[] = []
  strategyTypes : Object        [] = []
  engineCodes   : Object        [] = []
  profiles      : AgentProfile  [] = []
  tagSet        : string        [] = []

  title : string =""

  @ViewChild("tsNameCtrl")      tsNameCtrl?      : InputTextRequired
  @ViewChild("tsDataCtrl")      tsDataCtrl?      : DataProductSelector
  @ViewChild("tsBrokerCtrl")    tsBrokerCtrl?    : SelectRequired
  @ViewChild("tsSessionCtrl")   tsSessionCtrl?   : SelectRequired
  @ViewChild("tsTimeframeCtrl") tsTimeframeCtrl? : InputNumberRequired
  @ViewChild("tsStratTypeCtrl") tsStratTypeCtrl? : SelectRequired
  @ViewChild("tsProfileCtrl")   tsProfileCtrl?   : SelectRequired
  @ViewChild("tsExternRefCtrl") tsExternRefCtrl? : InputTextRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

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
