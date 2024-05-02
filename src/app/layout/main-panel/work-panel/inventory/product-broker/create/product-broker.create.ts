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
import {Connection, Currency, Exchange, ProductBrokerSpec} from "../../../../../../model/model";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";

//=============================================================================

@Component({
  selector    :     "productBroker-create",
  templateUrl :   './product-broker.create.html',
  styleUrls   : [ './product-broker.create.scss' ],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, NgForOf, //NgModel,
    MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule,
    MatDividerModule, InputTextRequired, SelectTextRequired, InputNumberRequired
  ],
  standalone  : true
})

//=============================================================================

export class ProductBrokerCreatePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  pb = new ProductBrokerSpec()
  connections : Connection[] = []
  markets     : Object[]     = []
  products    : Object[]     = []
  exchanges   : Exchange[]   = []

  @ViewChild("pbConnCtrl")         pbConnCtrl?         : SelectTextRequired
  @ViewChild("pbSymbolCtrl")       pbSymbolCtrl?       : InputTextRequired
  @ViewChild("pbNameCtrl")         pbNameCtrl?         : InputTextRequired
  @ViewChild("pbPointValueCtrl")   pbPointValueCtrl?   : InputNumberRequired
  @ViewChild("pbCostPerTradeCtrl") pbCostPerTradeCtrl? : InputNumberRequired
  @ViewChild("pbMarginValueCtrl")  pbMarginValueCtrl?  : InputNumberRequired
  @ViewChild("pbLocalClassCtrl")   pbLocalClassCtrl?   : InputTextRequired
  @ViewChild("pbMarketCtrl")       pbMarketCtrl?       : SelectTextRequired
  @ViewChild("pbProductCtrl")      pbProductCtrl?      : SelectTextRequired
  @ViewChild("pbExchangeCtrl")     pbExchangeCtrl?     : SelectTextRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.productBroker");
    super.subscribeToApp(AppEvent.PRODUCTDATA_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getConnections().subscribe(
      result => {
        this.connections = [];

        result.result.forEach( (c, i, a) => {
          if (c.id != null) {
            if (c.supportsBroker) {
              this.connections = [ ...this.connections, c]
            }
          }
        })
      })

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
    console.log("ProductDataEditPanel: Starting...");

    this.pb       = new ProductBrokerSpec()
    this.markets  = this.labelService.getLabel("map.market")
    this.products = this.labelService.getLabel("map.product")
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.pbConnCtrl        ?.isValid() &&
            this.pbSymbolCtrl      ?.isValid() &&
            this.pbNameCtrl        ?.isValid() &&
            this.pbPointValueCtrl  ?.isValid() &&
            this.pbCostPerTradeCtrl?.isValid() &&
            this.pbMarginValueCtrl ?.isValid() &&
            this.pbLocalClassCtrl  ?.isValid() &&
            this.pbMarketCtrl      ?.isValid() &&
            this.pbProductCtrl     ?.isValid() &&
            this.pbExchangeCtrl    ?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("Product for broker is : \n"+ JSON.stringify(this.pb));

    this.inventoryService.addProductBroker(this.pb).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.PRODUCTBROKER_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
