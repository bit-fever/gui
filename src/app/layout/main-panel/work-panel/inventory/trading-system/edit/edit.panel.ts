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
  TradingSystemSpec, AgentProfile
} from "../../../../../../model/model";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";
import {ChipSetTextComponent} from "../../../../../../component/form/chip-text-set/chip-set-text";
import {InputTextOptional} from "../../../../../../component/form/input-text-optional/input-text-optional";
import {SelectTextRequired} from "../../../../../../component/form/select-optional/select-optional";

//=============================================================================

@Component({
  selector    :     "tradingSystem-edit",
  templateUrl :   './edit.panel.html',
  styleUrls   : [ './edit.panel.scss' ],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, InputTextRequired, SelectRequired, InputNumberRequired, ChipSetTextComponent, InputTextOptional, SelectTextRequired
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
  data          : DataProduct   [] = []
  brokers       : BrokerProduct [] = []
  sessions      : TradingSession[] = []
  strategyTypes : Object        [] = []
  profiles      : AgentProfile  [] = []
  tagSet        : string        [] = []

  @ViewChild("tsNameCtrl")      tsNameCtrl?      : InputTextRequired
  @ViewChild("tsDataCtrl")      tsDataCtrl?      : SelectRequired
  @ViewChild("tsBrokerCtrl")    tsBrokerCtrl?    : SelectRequired
  @ViewChild("tsSessionCtrl")   tsSessionCtrl?   : SelectRequired
  @ViewChild("tsTimeframeCtrl") tsTimeframeCtrl? : InputNumberRequired
  @ViewChild("tsStratTypeCtrl") tsStratTypeCtrl? : SelectRequired
  @ViewChild("tsProfileCtrl")   tsProfileCtrl?   : SelectRequired
  @ViewChild("tsExternRefCtrl") tsExternRefCtrl? : InputTextOptional

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.tradingSystem", "tradingSystem");
    super.subscribeToApp(AppEvent.TRADINGSYSTEM_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getAgentProfiles().subscribe(
      result => {
        this.profiles = result.result;
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

    if (event.params == undefined) {
      this.ts = new TradingSystemSpec()
    }
    else {
      this.ts = Object.assign(new TradingSystemSpec(), event.params)
    }
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.tsNameCtrl     ?.isValid() &&
            this.tsDataCtrl     ?.isValid() &&
            this.tsBrokerCtrl   ?.isValid() &&
            this.tsSessionCtrl  ?.isValid() &&
            this.tsTimeframeCtrl?.isValid() &&
            this.tsStratTypeCtrl?.isValid() &&
            this.tsExternRefCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("TradingSystem is : \n"+ JSON.stringify(this.ts));

    this.ts.tags = this.tagSet.join("|")
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
