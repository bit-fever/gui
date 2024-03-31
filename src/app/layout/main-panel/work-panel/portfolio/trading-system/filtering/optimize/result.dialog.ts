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
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {Router} from "@angular/router";
import {SelectTextRequired} from "../../../../../../../component/form/select-required/select-text-required";
import {MatChipsModule} from "@angular/material/chips";
import {FilterRun} from "../../../../../../../model/model";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgIf} from "@angular/common";
import {InputIntRequired} from "../../../../../../../component/form/input-integer-required/input-int-required";
import {PortfolioService} from "../../../../../../../service/portfolio.service";
import {DialogData} from "./dialog-data";
import {FlexTablePanel} from "../../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../../../model/flex-table";

//=============================================================================

@Component({
  selector    : 'filter-result-dialog',
  templateUrl : 'result.dialog.html',
  styleUrls   : [ 'result.dialog.scss' ],
  imports: [MatDialogModule, MatButtonModule, SelectTextRequired, MatChipsModule, MatCheckboxModule,
            NgIf, InputIntRequired, FlexTablePanel],
  standalone  : true,
})

//=============================================================================

export class OptimizeResultDialog extends AbstractPanel {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns : FlexTableColumn[] = [];
  disUse  : boolean = true;
  runs    : FilterRun[] = [];
  selRun? : FilterRun

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private portfolioService: PortfolioService,
              private dialogRef       : MatDialogRef<OptimizeResultDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "portfolio.filtering.optimize");

    this.portfolioService.getFilterOptimizationInfo(this.data.tsId).subscribe(
      result => {
        if (result.runs) {
          this.runs = result.runs
        }
      }
    )
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

  onRowSelected(selection : FilterRun[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onRestart() {
    this.dialogRef.close({
      run: null
    })
  }

  //-------------------------------------------------------------------------

  onUse() {
    this.dialogRef.close({
      run: this.selRun
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------
  setupColumns = () => {
    let ts = this.labelService.getLabel("model.filterOptimiz");

    this.columns = [
      new FlexTableColumn(ts, "filterType"),
      new FlexTableColumn(ts, "days", ),
      new FlexTableColumn(ts, "newDays"),
      new FlexTableColumn(ts, "percentage"),
      new FlexTableColumn(ts, "netProfit"),
      new FlexTableColumn(ts, "avgTrade"),
      new FlexTableColumn(ts, "maxDrawdown"),
    ]
  }
  //-------------------------------------------------------------------------

  private updateButtons = (selection : FilterRun[]) => {
    this.disUse = (selection.length != 1)

    if (selection.length == 1) {
      this.selRun = selection[0]
    }
  }
}

//=============================================================================
