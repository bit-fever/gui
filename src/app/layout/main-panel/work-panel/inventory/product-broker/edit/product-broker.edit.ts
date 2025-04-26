//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
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
import {SystemAdapterService} from "../../../../../../service/system-adapter.service";
import {
  Adapter, Connection,
  ConnectionSpec, Currency, Exchange,
  Portfolio,
  BrokerProduct, BrokerProductSpec, DataProduct, DataProductSpec,
  TradingSession,
  TradingSystemSpec
} from "../../../../../../model/model";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {Url} from "../../../../../../model/urls";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";

//=============================================================================

@Component({
    selector: "productBroker-edit",
    templateUrl: './product-broker.edit.html',
    styleUrls: ['./product-broker.edit.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, NgForOf, //NgModel,
        MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule,
        MatDividerModule, InputTextRequired, SelectRequired, InputNumberRequired
    ]
})

//=============================================================================

export class ProductBrokerEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  pb = new BrokerProductSpec()
  markets     : Object[]   = []
  products    : Object[]   = []
  exchanges   : Exchange[] = []

  //---  The symbol cannot be changed because it is the root used to retrieve instruments from the broker

  @ViewChild("pbNameCtrl")         pbNameCtrl?         : InputTextRequired
  @ViewChild("pbPointValueCtrl")   pbPointValueCtrl?   : InputNumberRequired
  @ViewChild("pbCostPerOperCtrl")  pbCostPerOperCtrl?  : InputNumberRequired
  @ViewChild("pbMarginValueCtrl")  pbMarginValueCtrl?  : InputNumberRequired
  @ViewChild("pbIncrementCtrl")    pbIncrementCtrl?    : InputNumberRequired
  @ViewChild("pbMarketCtrl")       pbMarketCtrl?       : SelectRequired
  @ViewChild("pbProductCtrl")      pbProductCtrl?      : SelectRequired
  @ViewChild("pbExchangeCtrl")     pbExchangeCtrl?     : SelectRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.brokerProduct", "brokerProduct");
    super.subscribeToApp(AppEvent.BROKERPRODUCT_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getExchanges().subscribe(
      result => {
        this.exchanges = result.result;
      })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("ProductBrokerEditPanel: Starting...");

    this.pb       = Object.assign(new BrokerProductSpec(), event.params)
    this.markets  = this.labelService.getLabel("map.market")
    this.products = this.labelService.getLabel("map.product")
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.pbNameCtrl        ?.isValid() &&
            this.pbPointValueCtrl  ?.isValid() &&
            this.pbCostPerOperCtrl ?.isValid() &&
            this.pbMarginValueCtrl ?.isValid() &&
            this.pbIncrementCtrl   ?.isValid() &&
            this.pbMarketCtrl      ?.isValid() &&
            this.pbProductCtrl     ?.isValid() &&
            this.pbExchangeCtrl    ?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("Product for broker is : \n"+ JSON.stringify(this.pb));

    this.inventoryService.updateBrokerProduct(this.pb).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.BROKERPRODUCT_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
