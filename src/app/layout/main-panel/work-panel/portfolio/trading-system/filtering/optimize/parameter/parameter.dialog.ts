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
import {AbstractPanel} from "../../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../../service/label.service";
import {Router} from "@angular/router";
import {SelectTextRequired} from "../../../../../../../../component/form/select-required/select-text-required";
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";
import {FieldOptimization, FilterOptimizationRequest} from "../../../../../../../../model/model";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgIf} from "@angular/common";
import {InputNumberRequired} from "../../../../../../../../component/form/input-integer-required/input-number-required";
import {PortfolioService} from "../../../../../../../../service/portfolio.service";
import {DialogData} from "../dialog-data";
import {MatTabsModule} from "@angular/material/tabs";

//=============================================================================

@Component({
  selector    : 'filter-parameter-dialog',
  templateUrl : 'parameter.dialog.html',
  styleUrls   : [ 'parameter.dialog.scss' ],
  imports: [MatDialogModule, MatButtonModule, SelectTextRequired, MatChipsModule, MatCheckboxModule,
    NgIf, InputNumberRequired, MatTabsModule],
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
    this.resetOptions()
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

  onTrendlineChange(e: MatChipSelectionChange) {
    this.options.enableTrendline = e.selected;
    this.updateFields();
  }

  //-------------------------------------------------------------------------

  onReset() {
    this.resetOptions()
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

  private resetOptions() {
    let f = this.data.filter
    let o = new FilterOptimizationRequest()

    o.enableEquAvg           = !f.equAvgEnabled
    o.equAvgLen.enabled      = !f.equAvgEnabled
    o.equAvgLen.curValue     =  f.equAvgLen

    o.enablePosProfit        = !f.posProEnabled
    o.posProLen.enabled      = !f.posProEnabled
    o.posProLen.curValue     =  f.posProLen

    o.enableWinPerc          = !f.winPerEnabled
    o.winPercLen.enabled     = !f.winPerEnabled
    o.winPercPerc.enabled    = !f.winPerEnabled
    o.winPercLen.curValue    =  f.winPerLen
    o.winPercPerc.curValue   =  f.winPerValue

    o.enableOldNew           = !f.oldNewEnabled
    o.oldNewOldLen.enabled   = !f.oldNewEnabled
    o.oldNewNewLen.enabled   = !f.oldNewEnabled
    o.oldNewOldPerc.enabled  = !f.oldNewEnabled
    o.oldNewOldLen.curValue  =  f.oldNewOldLen
    o.oldNewNewLen.curValue  =  f.oldNewNewLen
    o.oldNewOldPerc.curValue =  f.oldNewOldPerc

    o.enableTrendline        = !f.trendlineEnabled
    o.trendlineLen.enabled   = !f.trendlineEnabled
    o.trendlineValue.enabled = !f.trendlineEnabled
    o.trendlineLen.curValue  =  f.trendlineLen
    o.trendlineValue.curValue=  f.trendlineValue

    this.options = o
  }

  //-------------------------------------------------------------------------

  private updateFields() {
    //TODO: update "run" button and add value validation
  }
}

//=============================================================================
