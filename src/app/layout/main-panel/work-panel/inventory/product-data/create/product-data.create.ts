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
import {
  Connection, Exchange,
  ProductDataSpec,
} from "../../../../../../model/model";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";

//=============================================================================

enum Status {
  Selecting = 0,
  Local     = 1,
  Inventory = 2
}

//=============================================================================

@Component({
  selector    :     "productData-create",
  templateUrl :   './product-data.create.html',
  styleUrls   : [ './product-data.create.scss' ],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, NgForOf, //NgModel,
    MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule,
    MatDividerModule, InputTextRequired, SelectTextRequired, InputNumberRequired
  ],
  standalone  : true
})

//=============================================================================

export class ProductDataCreatePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  pd = new ProductDataSpec()
  connections : Connection[] = []
  exchanges   : Exchange[]   = []
  markets     : Object = {}
  products    : Object = {}

  status = Status.Selecting

  @ViewChild("pdConnCtrl")     pdConnCtrl?     : SelectTextRequired

  @ViewChild("pdSymbolCtrl")   pdSymbolCtrl?   : InputTextRequired
  @ViewChild("pdNameCtrl")     pdNameCtrl?     : InputTextRequired
  @ViewChild("pdIncremCtrl")   pdIncremCtrl?   : InputNumberRequired
  @ViewChild("pdMarketCtrl")   pdMarketCtrl?   : SelectTextRequired
  @ViewChild("pdProductCtrl")  pdProductCtrl?  : SelectTextRequired
  @ViewChild("pdExchangeCtrl") pdExchangeCtrl? : SelectTextRequired

  private connMap = new Map<number, Connection>()

  //-------------------------------------------------------------------------

  readonly Status = Status

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.productData", "productData");
    super.subscribeToApp(AppEvent.PRODUCTDATA_CREATE_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getConnections().subscribe(
      result => {
        this.connections = [];
        this.connMap     = new Map<number, Connection>()

        result.result.forEach( (c, i, a) => {
          if (c.id != null) {
            if (c.supportsData) {
              this.connections = [ ...this.connections, c]
              this.connMap.set(c.id, c)
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
    console.log("ProductDataCreatePanel: Starting...");

    this.pd       = new ProductDataSpec()
    this.status   = Status.Selecting
    this.markets  = this.labelService.getLabel("map.market")
    this.products = this.labelService.getLabel("map.product")
  }

  //-------------------------------------------------------------------------

  onConnectionChange(key: any) {
    console.log("Selected: "+key)

    let conn = this.connMap.get(key)

    if (conn) {
      if (conn.supportsInventory) {
        this.status = Status.Inventory
      }
      else {
        this.status = Status.Local
      }
    }
    else {
      this.status = Status.Selecting
    }
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.pdConnCtrl    ?.isValid() &&
            this.pdSymbolCtrl  ?.isValid() &&
            this.pdNameCtrl    ?.isValid() &&
            this.pdIncremCtrl  ?.isValid() &&
            this.pdMarketCtrl  ?.isValid() &&
            this.pdProductCtrl ?.isValid() &&
            this.pdExchangeCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("Product for data is : \n"+ JSON.stringify(this.pd));

    this.inventoryService.addProductData(this.pd).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.PRODUCTDATA_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }
}

//=============================================================================
