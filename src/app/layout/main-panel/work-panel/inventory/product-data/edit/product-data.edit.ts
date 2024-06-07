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
  ConnectionSpec, Exchange,
  Portfolio,
  ProductBroker, ProductData, ProductDataSpec,
  TradingSession,
  TradingSystemSpec
} from "../../../../../../model/model";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {Url} from "../../../../../../model/urls";
import {PortfolioService} from "../../../../../../service/portfolio.service";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";

//=============================================================================

@Component({
  selector    :     "productData-edit",
  templateUrl :   './product-data.edit.html',
  styleUrls   : [ './product-data.edit.scss' ],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, NgForOf, //NgModel,
    MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule,
    MatDividerModule, InputTextRequired, SelectTextRequired, InputNumberRequired
  ],
  standalone  : true
})

//=============================================================================

export class ProductDataEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  pd = new ProductDataSpec()
  markets     : Object[]   = []
  products    : Object[]   = []

  //--- The symbol and exchanges cannot be changed because
  //---  - symbol  : is the root used to retrieve instruments from the datasource
  //---  - exchange: its timezone is used to convert the timestamp of data

  @ViewChild("pdNameCtrl")     pdNameCtrl?     : InputTextRequired
  @ViewChild("pdIncremCtrl")   pdIncremCtrl?   : InputNumberRequired
  @ViewChild("pdMarketCtrl")   pdMarketCtrl?   : SelectTextRequired
  @ViewChild("pdProductCtrl")  pdProductCtrl?  : SelectTextRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService) {

    super(eventBusService, labelService, router, "inventory.productData");
    super.subscribeToApp(AppEvent.PRODUCTDATA_EDIT_START, (e : AppEvent) => this.onStart(e));
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("ProductDataEditPanel: Starting...");

    this.pd       = event.params
    this.markets  = this.labelService.getLabel("map.market")
    this.products = this.labelService.getLabel("map.product")
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.pdNameCtrl    ?.isValid() &&
            this.pdIncremCtrl  ?.isValid() &&
            this.pdMarketCtrl  ?.isValid() &&
            this.pdProductCtrl ?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

    console.log("Product for data is : \n"+ JSON.stringify(this.pd));

    this.inventoryService.updateProductData(this.pd).subscribe( c => {
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
