//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, } from "@angular/core";
import {Router} from "@angular/router";
import {AbstractPanel} from "../../abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {CollectorService} from "../../../service/collector.service";
import {FileUploader} from "../file-uploader/file-uploader";
import {InputTextRequired} from "../input-text-required/input-text-required";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {MatProgressBar} from "@angular/material/progress-bar";
import {SelectRequired} from "../select-required/select-required";
import {FlexTablePanel} from "../../panel/flex-table/flex-table.panel";
import {FlexTableColumn, ListResponse, ListService} from "../../../model/flex-table";
import {BrokerProduct, DataInstrumentFull, DataProduct, DataProductFull} from "../../../model/model";
import {LabelTranscoder} from "../../panel/flex-table/transcoders";
import {InventoryService} from "../../../service/inventory.service";
import {Observable} from "rxjs";

//=============================================================================

@Component({
    selector: 'data-product-selector-dialog',
    templateUrl: 'product-selector.dialog.html',
    styleUrls:  ['product-selector.dialog.scss'],
    imports: [MatDialogModule, MatButtonModule, FlexTablePanel]
})

//=============================================================================

export class DataProductSelectorDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  disSelect: boolean = true
  columns  : FlexTableColumn[] = [];
  service  : ListService<DataProductFull>;

  currProduct? : DataProductFull

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService,
              private dialogRef       : MatDialogRef<DataProductSelectorDialog>) {

    super(eventBusService, labelService, router, "dialog.dataProductSelector");

    this.service = this.getDataProducts;
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  private getDataProducts = (): Observable<ListResponse<DataProductFull>> => {
    return this.inventoryService.getDataProducts(true);
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.dataProduct");

    this.columns = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "connectionName"),
      new FlexTableColumn(ts, "systemCode"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : DataProductFull[]) {
    this.disSelect   = (selection.length != 1)
    this.currProduct = selection[0]
  }

  //-------------------------------------------------------------------------

  onSelect() {
    this.dialogRef.close(this.currProduct)
  }

  //-------------------------------------------------------------------------

  onCancel() {
    this.dialogRef.close(undefined)
  }
}

//=============================================================================
