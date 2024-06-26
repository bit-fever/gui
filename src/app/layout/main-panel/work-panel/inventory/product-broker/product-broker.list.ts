//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {InvTradingSystemFull, ProductBroker, ProductData} from "../../../../../model/model";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router, RouterModule} from "@angular/router";
import {Url} from "../../../../../model/urls";
import {AppEvent} from "../../../../../model/event";
import {Observable} from "rxjs";
import {InventoryService} from "../../../../../service/inventory.service";
import {LabelTranscoder} from "../../../../../component/panel/flex-table/transcoders";

//=============================================================================

@Component({
  selector    :     'inventory-product-broker',
  templateUrl :   './product-broker.list.html',
  styleUrls   : [ './product-broker.list.scss' ],
  imports     : [ CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
    RouterModule, FlexTablePanel],
  standalone  : true
})

//=============================================================================

export class InvProductBrokerPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<ProductBroker>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<ProductBroker>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService) {

    super(eventBusService, labelService, router, "inventory.productBroker");

    this.service = this.getProductBrokers;

    eventBusService.subscribeToApp(AppEvent.PRODUCTBROKER_LIST_RELOAD, () => {
      this.table?.reload()
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  private getProductBrokers = (): Observable<ListResponse<ProductBroker>> => {
    return this.inventoryService.getProductBrokers(true);
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : ProductBroker[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Inventory_ProductBroker, Url.Right_ProductBroker_Create, AppEvent.PRODUCTBROKER_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      console.log(JSON.stringify(selection))
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();
    this.openRightPanel(Url.Inventory_ProductBroker, Url.Right_ProductBroker_Edit, AppEvent.PRODUCTBROKER_EDIT_START, selection[0]);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.productBroker");

    this.columns = [
      // new FlexTableColumn(ts, "username"),
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "marketType", new LabelTranscoder(this.labelService, "map.market")),
      // new FlexTableColumn(ts, "productType"),
      new FlexTableColumn(ts, "exchangeCode"),
      new FlexTableColumn(ts, "connectionCode"),
      new FlexTableColumn(ts, "currencyCode"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : ProductBroker[]) => {
    this.disView = (selection.length != 1)
    this.disEdit = (selection.length != 1)
  }
}

//=============================================================================
