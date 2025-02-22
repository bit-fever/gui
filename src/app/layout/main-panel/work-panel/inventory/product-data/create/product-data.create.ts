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
import {Connection, DataProductSpec, Exchange} from "../../../../../../model/model";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";
import {MatDialog} from "@angular/material/dialog";
import {
  PresetProductSelectorDialog
} from "../../../../../../component/form/preset-product-selector/preset-product-selector.dialog";
import {PresetProduct} from "../../../../../../service/presets.service";

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
    MatDividerModule, InputTextRequired, SelectRequired, InputNumberRequired
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

  pd = new DataProductSpec()
  connections : Connection[] = []
  markets     : Object = {}
  products    : Object = {}
  exchanges   : Exchange[]   = []

  status = Status.Selecting

  @ViewChild("pdConnCtrl")     pdConnCtrl?     : SelectRequired

  @ViewChild("pdSymbolCtrl")   pdSymbolCtrl?   : InputTextRequired
  @ViewChild("pdNameCtrl")     pdNameCtrl?     : InputTextRequired
  @ViewChild("pdMarketCtrl")   pdMarketCtrl?   : SelectRequired
  @ViewChild("pdProductCtrl")  pdProductCtrl?  : SelectRequired
  @ViewChild("pdExchangeCtrl") pdExchangeCtrl? : SelectRequired

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
              public  dialog           : MatDialog,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.dataProduct", "dataProduct");
    super.subscribeToApp(AppEvent.DATAPRODUCT_CREATE_START, (e : AppEvent) => this.onStart(e));

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

    this.pd       = new DataProductSpec()
    this.status   = Status.Selecting
    this.markets  = this.labelService.getLabel("map.market")
    this.products = this.labelService.getLabel("map.product")
  }

  //-------------------------------------------------------------------------

  onConnectionChange(key: any) {
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
            this.pdMarketCtrl  ?.isValid() &&
            this.pdProductCtrl ?.isValid() &&
            this.pdExchangeCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("Data product is : \n"+ JSON.stringify(this.pd));

    this.inventoryService.addDataProduct(this.pd).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.DATAPRODUCT_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onPresets() : void {
    const dialogRef = this.dialog.open(PresetProductSelectorDialog, {
      minWidth: "1024px",
      minHeight: "800px",
      data: {
      }
    })

    dialogRef.afterClosed().subscribe((pp : PresetProduct) => {
      if (pp) {
        this.pd.symbol      = pp.symbol
        this.pd.name        = pp.name
        this.pd.marketType  = pp.market
        this.pd.productType = pp.product
        this.pd.exchangeId  = this.getExchangeId(pp.exchange)
      }
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
    super.emitToApp(event);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getExchangeId(code : string) : number {
  let id = 0

    this.exchanges.forEach( ex => {
      if (ex.code == code) {
        if (ex.id) {
          id = ex.id
        }
      }
    })

    return id
  }
}

//=============================================================================
