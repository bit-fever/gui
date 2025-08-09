//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject,} from "@angular/core";
import {Router} from "@angular/router";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormControl, FormControlStatus, ReactiveFormsModule, Validators} from "@angular/forms";
import {FlexTablePanel} from "../../panel/flex-table/flex-table.panel";
import {AbstractPanel} from "../../abstract.panel";
import {FlexTableColumn} from "../../../model/flex-table";
import {RootSymbol} from "../../../model/model";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {SystemAdapterService} from "../../../service/system-adapter.service";
import {DialogData} from "./dialog-data";

//=============================================================================

@Component({
  selector: 'root-selector-dialog',
  templateUrl: 'root-product-selector.dialog.html',
  styleUrls: [ 'root-product-selector.dialog.scss'],
  imports: [MatDialogModule, MatButtonModule, FlexTablePanel, MatFormField, MatInput, MatLabel, NgIf, MatFormField, ReactiveFormsModule]
})

//=============================================================================

export class RootProductSelectorDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns   : FlexTableColumn[] = [];
  roots     : RootSymbol     [] = []
  currRoot? : RootSymbol
  disSelect : boolean = true
  disSearch : boolean = true
  filter    : string  = ""

  formControl = new FormControl('', [Validators.required])

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private adapterService  : SystemAdapterService,
              private dialogRef       : MatDialogRef<RootProductSelectorDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "dialog.rootProductSelector");
    this.formControl.statusChanges.subscribe(this.valueChanged)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.rootSymbol");

    this.columns = [
      new FlexTableColumn(ts, "code"),
      new FlexTableColumn(ts, "instrument"),
      new FlexTableColumn(ts, "exchange"),
      new FlexTableColumn(ts, "country"),
      new FlexTableColumn(ts, "currency"),
      new FlexTableColumn(ts, "pointValue"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  handleEnter(event: Event) {
    // @ts-ignore
    if (event["code"] == "Enter") {
      this.onSearch()
    }
  }

  //-------------------------------------------------------------------------

  onSearch() {
    this.adapterService.getRootSymbols(this.data.connectionCode, this.filter).subscribe(res => {
      this.roots = res.result

      if (this.roots == undefined) {
        this.roots = []
      }
    })
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : RootSymbol[]) {
    this.disSelect = (selection.length != 1)
    this.currRoot  = selection[0]
  }

  //-------------------------------------------------------------------------

  onSelect() {
    //--- To get the "increment" field, we have to call another service
    if (this.currRoot != undefined) {
      this.adapterService.getRootSymbol(this.data.connectionCode, this.currRoot.code).subscribe(res => {
        this.dialogRef.close(res)
      })
    }
  }

  //-------------------------------------------------------------------------

  onCancel() {
    this.dialogRef.close(undefined)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private valueChanged = (s : FormControlStatus) => {
    this.disSearch = true
    this.filter    = ""

    if (this.formControl.value != undefined) {
      this.disSearch = this.formControl.value.length == 0
      this.filter    = this.formControl.value
    }
  }
}

//=============================================================================
