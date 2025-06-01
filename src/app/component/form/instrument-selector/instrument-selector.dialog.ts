//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
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
import {FlexTableColumn, ListService} from "../../../model/flex-table";
import {DataInstrumentFull, DataProduct} from "../../../model/model";
import {LabelTranscoder} from "../../panel/flex-table/transcoders";

//=============================================================================

@Component({
    selector: 'instrument-selector-dialog',
    templateUrl: 'instrument-selector.dialog.html',
    styleUrls: ['instrument-selector.dialog.scss'],
    imports: [MatDialogModule, MatButtonModule, FileUploader, InputTextRequired, MatChipListbox, MatChipOption, MatProgressBar, SelectRequired, FlexTablePanel]
})

//=============================================================================

export class InstrumentSelectorDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  disSelect: boolean = true
  columns  : FlexTableColumn[] = [];
  service  : ListService<DataInstrumentFull>;

  currInstrument? : DataInstrumentFull

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private collectorService: CollectorService,
              private dialogRef       : MatDialogRef<InstrumentSelectorDialog>) {

    super(eventBusService, labelService, router, "instrumentSelector");

    this.service = collectorService.getDataInstruments;
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
    let ts = this.labelService.getLabel("model.dataInstrument");

    this.columns = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "productSymbol"),
      new FlexTableColumn(ts, "connectionCode"),
      new FlexTableColumn(ts, "systemCode"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Event methods
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : DataInstrumentFull[]) {
    this.disSelect      = (selection.length != 1)
    this.currInstrument = selection[0]
  }

  //-------------------------------------------------------------------------

  onSelect() {
    this.dialogRef.close(this.currInstrument)
  }

  //-------------------------------------------------------------------------

  onCancel() {
    this.dialogRef.close(undefined)
  }
}

//=============================================================================
