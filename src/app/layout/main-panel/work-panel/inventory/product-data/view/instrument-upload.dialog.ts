//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {DialogData} from "./dialog-data";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputTextRequired} from "../../../../../../component/form/input-text-required/input-text-required";
import {DatePicker} from "../../../../../../component/form/date-picker/date-picker";

//=============================================================================

@Component({
  selector    : 'instrument-upload-dialog',
  templateUrl : 'instrument-upload.dialog.html',
  styleUrls   : [ 'instrument-upload.dialog.scss' ],
  imports: [MatDialogModule, MatButtonModule, NgIf, MatProgressSpinnerModule, MatGridListModule,
    MatIconModule, InputTextRequired, DatePicker],
  standalone  : true,
})

//=============================================================================

export class InstrumentUploadDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  symbol?    : string
  name?      : string
  expirDate  : number|null = null

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService,
              private dialogRef       : MatDialogRef<InstrumentUploadDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "inventory.productData.upload", "instrumentData");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  onUpload() {
    this.dialogRef.close(true)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
