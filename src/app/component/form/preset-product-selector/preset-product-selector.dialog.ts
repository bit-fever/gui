//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, ViewChild,} from "@angular/core";
import {Router} from "@angular/router";
import {AbstractPanel} from "../../abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {FlexTableFilter, FlexTablePanel} from "../../panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../model/flex-table";
import {PresetProduct, PresetsService} from "../../../service/presets.service";
import {AppEvent} from "../../../model/event";
import {LabelTranscoder} from "../../panel/flex-table/transcoders";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";

//=============================================================================

@Component({
    selector: 'instrument-selector-dialog',
    templateUrl: 'preset-product-selector.dialog.html',
    styleUrls: ['preset-product-selector.dialog.scss'],
  imports: [MatDialogModule, MatButtonModule, FlexTablePanel, MatButtonToggle, MatButtonToggleGroup, ReactiveFormsModule]
})

//=============================================================================

export class PresetProductSelectorDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  disSelect: boolean = true
  columns  : FlexTableColumn[] = [];
  products : PresetProduct[];

  selFilter = new FormControl("all")

  currProduct? : PresetProduct

  @ViewChild("table") table : FlexTablePanel | undefined

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService       : EventBusService,
              labelService          : LabelService,
              router                : Router,
              private presetsService: PresetsService,
              private dialogRef     : MatDialogRef<PresetProductSelectorDialog>) {

    super(eventBusService, labelService, router, "dialog.presetProductSelector");

    this.products = presetsService.getProducts();

    //--- Just in case the presets are not yet loaded
    eventBusService.subscribeToApp(AppEvent.PRESETS_READY, () => {
      this.products = presetsService.getProducts();
    })
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
    let ts = this.labelService.getLabel("model.presetProduct");

    this.columns = [
      new FlexTableColumn(ts, "symbolDefault"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "market", new LabelTranscoder(this.labelService, "map.market")),
      new FlexTableColumn(ts, "exchange"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : PresetProduct[]) {
    this.disSelect   = (selection.length != 1)
    this.currProduct = selection[0]
  }

  //-------------------------------------------------------------------------

  onSelect() {
    this.dialogRef.close(this.currProduct)
  }

  //-------------------------------------------------------------------------

  onFilterChange() {
    this.table?.applyFilter()
  }

  //-------------------------------------------------------------------------

  onCancel() {
    this.dialogRef.close(undefined)
  }

  //-------------------------------------------------------------------------

  tableFilter: FlexTableFilter<PresetProduct> = (row: PresetProduct, filter: string) : boolean => {
    let matches = (filter.length==0)                ||
                          (row.symbolDefault?.toLowerCase().indexOf(filter) != -1) ||
                          (row.name          .toLowerCase().indexOf(filter) != -1)

    let mode = this.selFilter.value

    if (mode == "all") {
      return matches
    }

    if (mode == "standard") {
      return matches && !row.micro
    }

    return matches && row.micro
  }
}

//=============================================================================
