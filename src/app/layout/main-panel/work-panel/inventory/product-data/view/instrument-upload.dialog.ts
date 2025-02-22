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
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";

//=============================================================================

@Component({
  selector    : 'instrument-upload-dialog',
  templateUrl : 'instrument-upload.dialog.html',
  styleUrls   : [ 'instrument-upload.dialog.scss' ],
  imports: [MatDialogModule, MatButtonModule, NgIf, MatProgressSpinnerModule, MatGridListModule,
    MatIconModule, InputTextRequired, DatePicker, FileUploader, MatProgressBarModule, SelectRequired, MatChipsModule],
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

  fileTimezones = {}
  parsers : ParserMap = {}

  //-------------------------------------------------------------------------

  @ViewChild("iuSymbolCtrl")     symbolCtrl?       : InputTextRequired
  @ViewChild("iuNameCtrl")       nameCtrl?         : InputTextRequired
  @ViewChild("fileUpload")       fileUploader?     : FileUploader
  @ViewChild("fileTimezoneCtrl") fileTimezoneCtrl? : SelectRequired
  @ViewChild("parserCtrl")       parserCtrl?       : SelectRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private collectorService: CollectorService,
              private dialogRef       : MatDialogRef<InstrumentUploadDialog>,
              private snackBar        : MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "inventory.dataProduct.upload", "dataInstrument");

    collectorService.getParsers().subscribe(
      result => {
        this.parsers       = result;
        this.fileTimezones = this.labelService.getLabel("map.fileTimezone")
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
    if (this.data.dataProduct.id) {
      id = this.data.dataProduct.id
    }

    this.collectorService.uploadDataInstrumentData(id, this.spec, this.files).subscribe(
      event => {
        if (event.isInProgress()) {
          this.progress = event.percentage
        }

        else if (event.isInError()) {
          this.snackBar.open(this.loc("error") +" : "+ event.error, this.button("ok"))
          this.dialogRef.close(true)
        }
        else if (event.isCompleted()) {
          let message = this.loc("success") +" ("+event.result?.duration+" secs)"
          this.snackBar.open(message, this.button("ok"))
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
    return  this.symbolCtrl      ?.isValid() &&
            this.nameCtrl        ?.isValid() &&
            this.fileTimezoneCtrl?.isValid() &&
            this.parserCtrl      ?.isValid() &&
            !this.uploadDisabled
  }
}

//=============================================================================
