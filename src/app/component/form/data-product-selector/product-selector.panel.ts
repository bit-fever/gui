//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {MatDialog} from "@angular/material/dialog";
import {DataProductSelectorDialog} from "./product-selector.dialog";
import {DataProductFull} from "../../../model/model";
import {InventoryService} from "../../../service/inventory.service";

//=============================================================================

@Component({
    selector: 'data-product-selector',
    templateUrl: './product-selector.panel.html',
    styleUrls: [ './product-selector.panel.scss'],
    imports: [CommonModule, MatFormFieldModule, MatInput, FormsModule, MatIconButton, MatIcon]
})

//=============================================================================

export class DataProductSelector extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  selectedId? : number
  symbol?     : string
  name?       : string
  connection? : string

  @Output() productIdChange : EventEmitter<number|undefined> = new EventEmitter<number|undefined>();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              private labelService     : LabelService,
              private inventoryService : InventoryService,
              public  dialog           : MatDialog) {

    super(eventBusService);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  get productId() : number|undefined {
    return this.selectedId
  }

  //-------------------------------------------------------------------------

  @Input()
  set productId(id : number|undefined) {
    this.selectedId = id
    this.symbol     = undefined
    this.name       = undefined
    this.connection = undefined

    if (id != undefined) {
      this.inventoryService.getDataProductById(id).subscribe( dpe => {
        this.symbol     = dpe.symbol;
        this.name       = dpe.name;
        this.connection = dpe.connection?.name;
      })
    }
  }

  //-------------------------------------------------------------------------

  public loc = (code : string) : string => {
    return this.labelService.getLabelString("page.dialog.dataProductSelector."+ code);
  }

  //---------------------------------------------------------------------------

  public hint() : string|undefined {
    if (this.productId) {
      return this.connection;
    }

    return this.loc("message")
  }

  //---------------------------------------------------------------------------

  public text() : string {
    if (this.productId) {
      return this.symbol +" : "+ this.name;
    }

    return ""
  }

  //---------------------------------------------------------------------------

  public isValid() : boolean {
    return this.selectedId != undefined
  }

  //---------------------------------------------------------------------------

  onSearch() {
    const dialogRef = this.dialog.open(DataProductSelectorDialog, {
      minWidth: "1024px",
      data: {
      }
    })

    dialogRef.afterClosed().subscribe((dpf : DataProductFull) => {
      if (dpf) {
        this.selectedId = dpf.id
        this.symbol     = dpf.symbol;
        this.name       = dpf.name;
        this.connection = dpf.connectionName;

        this.productIdChange.emit(dpf.id)
      }
    })
  }
}

//=============================================================================
