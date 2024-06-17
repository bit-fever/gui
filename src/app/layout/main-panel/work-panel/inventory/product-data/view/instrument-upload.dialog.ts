//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject, ViewChild} from "@angular/core";
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
import {FileUploader} from "../../../../../../component/form/file-uploader/file-uploader";
import {DatafileUploadSpec, ParserMap} from "../../../../../../model/model";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CollectorService} from "../../../../../../service/collector.service";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";

//=============================================================================

@Component({
  selector    : 'instrument-upload-dialog',
  templateUrl : 'instrument-upload.dialog.html',
  styleUrls   : [ 'instrument-upload.dialog.scss' ],
  imports: [MatDialogModule, MatButtonModule, NgIf, MatProgressSpinnerModule, MatGridListModule,
    MatIconModule, InputTextRequired, DatePicker, FileUploader, MatProgressBarModule, SelectTextRequired, MatChipsModule],
  standalone  : true,
})

//=============================================================================

export class InstrumentUploadDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  spec = new DatafileUploadSpec()
  files :any[] = []
  progress = 0
  uploadDisabled = true
  buttonsDisabled = false

  timezones = {}
  parsers : ParserMap = {}

  //-------------------------------------------------------------------------

  @ViewChild("iuSymbolCtrl") symbolCtrl?   : InputTextRequired
  @ViewChild("iuNameCtrl")   nameCtrl?     : InputTextRequired
  @ViewChild("fileUpload")   fileUploader? : FileUploader
  @ViewChild("timezoneCtrl") timezoneCtrl? : SelectTextRequired
  @ViewChild("parserCtrl")   parserCtrl?   : SelectTextRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private inventoryService: InventoryService,
              private collectorService: CollectorService,
              private dialogRef       : MatDialogRef<InstrumentUploadDialog>,
              private snackBar        : MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "inventory.productData.upload", "instrumentData");

    collectorService.getParsers().subscribe(
      result => {
        this.parsers   = result;
        this.timezones = this.labelService.getLabel("map.uploadTimezone")
      })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  onContinuousChange(e: MatChipSelectionChange) {
    this.spec.continuous = e.selected;
  }

  //-------------------------------------------------------------------------

  onFileChange(files : any[]) {
    this.files          = files
    this.uploadDisabled = files.length == 0
  }

  //-------------------------------------------------------------------------

  onUpload() {
    this.buttonsDisabled = true
    this.uploadDisabled  = true

    let id : number = 0
    if (this.data.productData.id) {
      id = this.data.productData.id
    }

    this.collectorService.uploadInstrumentData(id, this.spec, this.files).subscribe(
      event => {
        if (event.isInProgress()) {
          this.progress = event.percentage
        }

        else if (event.isInError()) {
          this.snackBar.open(this.loc("error") +" : "+ event.error, this.button("ok"))
          this.dialogRef.close(true)
        }
        else if (event.isCompleted()) {
          this.snackBar.open(this.loc("success"), this.button("ok"))
          this.dialogRef.close(true)
        }
        else {
          //--- Skip other
        }

        console.log(JSON.stringify(event))
      })
  }

  //-------------------------------------------------------------------------

  public uploadEnabled() : boolean|undefined {
    return  this.symbolCtrl  ?.isValid() &&
            this.nameCtrl    ?.isValid() &&
            this.timezoneCtrl?.isValid() &&
            this.parserCtrl  ?.isValid() &&
            !this.uploadDisabled
  }
}

//=============================================================================
