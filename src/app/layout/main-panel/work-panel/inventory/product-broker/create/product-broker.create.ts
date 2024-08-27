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
import {BrokerProductSpec, Connection, Exchange} from "../../../../../../model/model";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";
import {
  PresetProductSelectorDialog
} from "../../../../../../component/form/preset-product-selector/preset-product-selector.dialog";
import {PresetProduct} from "../../../../../../service/presets.service";
import {MatDialog} from "@angular/material/dialog";

//=============================================================================

enum Status {
  Selecting = 0,
  Local     = 1,
  Inventory = 2
}

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

export class BrokerProductCreatePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  pb = new BrokerProductSpec()
  connections : Connection[] = []
  markets     : Object[]     = []
  products    : Object[]     = []
  exchanges   : Exchange[]   = []

  status = Status.Selecting

  @ViewChild("pbConnCtrl")         pbConnCtrl?         : SelectTextRequired

  @ViewChild("pbSymbolCtrl")       pbSymbolCtrl?       : InputTextRequired
  @ViewChild("pbNameCtrl")         pbNameCtrl?         : InputTextRequired
  @ViewChild("pbPointValueCtrl")   pbPointValueCtrl?   : InputNumberRequired
  @ViewChild("pbCostPerTradeCtrl") pbCostPerTradeCtrl? : InputNumberRequired
  @ViewChild("pbMarginValueCtrl")  pbMarginValueCtrl?  : InputNumberRequired
  @ViewChild("pbIncrementCtrl")    pdIncrementCtrl?    : InputNumberRequired
  @ViewChild("pbMarketCtrl")       pbMarketCtrl?       : SelectTextRequired
  @ViewChild("pbProductCtrl")      pbProductCtrl?      : SelectTextRequired
  @ViewChild("pbExchangeCtrl")     pbExchangeCtrl?     : SelectTextRequired

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

    super(eventBusService, labelService, router, "inventory.brokerProduct", "brokerProduct");
    super.subscribeToApp(AppEvent.BROKERPRODUCT_CREATE_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getConnections().subscribe(
      result => {
        this.connections = [];
        this.connMap     = new Map<number, Connection>()

        result.result.forEach( (c, i, a) => {
          if (c.id != null) {
            if (c.supportsBroker) {
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
    console.log("ProductBrokerCreatePanel: Starting...");

    this.pb       = new BrokerProductSpec()
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
    return  this.pbConnCtrl        ?.isValid() &&
            this.pbSymbolCtrl      ?.isValid() &&
            this.pbNameCtrl        ?.isValid() &&
            this.pbPointValueCtrl  ?.isValid() &&
            this.pbCostPerTradeCtrl?.isValid() &&
            this.pbMarginValueCtrl ?.isValid() &&
            this.pdIncrementCtrl   ?.isValid() &&
            this.pbMarketCtrl      ?.isValid() &&
            this.pbProductCtrl     ?.isValid() &&
            this.pbExchangeCtrl    ?.isValid()
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
        this.pb.symbol      = pp.symbol
        this.pb.name        = pp.name
        this.pb.increment   = pp.increment
        this.pb.marketType  = pp.market
        this.pb.productType = pp.product
        this.pb.exchangeId  = this.getExchangeId(pp.exchange)
        this.pb.pointValue  = pp.pointValue
        this.pb.costPerTrade= pp.costPerTrade
        this.pb.marginValue = pp.margin
      }
    })
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("Broker product is : \n"+ JSON.stringify(this.pb));

    this.inventoryService.addBrokerProduct(this.pb).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.BROKERPRODUCT_LIST_RELOAD))
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
