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
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";
import {FilterOptimizationRequest} from "../../../../../../../model/model";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgIf} from "@angular/common";
import {InputNumberRequired} from "../../../../../../../component/form/input-integer-required/input-number-required";
import {PortfolioService} from "../../../../../../../service/portfolio.service";
import {DialogData} from "./dialog-data";

//=============================================================================

@Component({
  selector    : 'filter-parameter-dialog',
  templateUrl : 'parameter.dialog.html',
  styleUrls   : [ 'parameter.dialog.scss' ],
  imports: [MatDialogModule, MatButtonModule, SelectTextRequired, MatChipsModule, MatCheckboxModule,
            NgIf, InputNumberRequired],
  standalone  : true,
})

//=============================================================================

export class OptimizeParameterDialog extends AbstractPanel {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  options : FilterOptimizationRequest = new FilterOptimizationRequest()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private portfolioService: PortfolioService,
              private dialogRef       : MatDialogRef<OptimizeParameterDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "portfolio.filtering.optimize");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  onPosProfitChange(e: MatChipSelectionChange) {
    this.options.enablePosProfit = e.selected;
    this.updateFields();
  }

  //-------------------------------------------------------------------------

  onOldVsNewChange(e: MatChipSelectionChange) {
    this.options.enableOldNew = e.selected;
    this.updateFields();
  }

  //-------------------------------------------------------------------------

  onWinPercChange(e: MatChipSelectionChange) {
    this.options.enableWinPerc = e.selected;
    this.updateFields();
  }

  //-------------------------------------------------------------------------

  onEquVsAvgChange(e: MatChipSelectionChange) {
    this.options.enableEquAvg = e.selected;
    this.updateFields();
  }

  //-------------------------------------------------------------------------

  onRun() {
    this.portfolioService.startFilterOptimization(this.data.tsId, this.options).subscribe(
      result => {
        this.dialogRef.close(true)
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateFields() {
    //TODO: update "run" button and add value validation
  }
}

//=============================================================================
