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
import {NgIf} from "@angular/common";
import {PortfolioService} from "../../../../../../../service/portfolio.service";
import {DialogData} from "./dialog-data";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatGridListModule} from "@angular/material/grid-list";
import {Subscription, timer} from "rxjs";
import {FilterOptimizationResponse} from "../../../../../../../model/model";
import {MatIconModule} from "@angular/material/icon";

//=============================================================================

@Component({
  selector    : 'filter-progress-dialog',
  templateUrl : 'progress.dialog.html',
  styleUrls   : [ 'progress.dialog.scss' ],
  imports: [MatDialogModule, MatButtonModule, NgIf, MatProgressSpinnerModule, MatGridListModule,
            MatIconModule],
  standalone  : true,
})

//=============================================================================

export class OptimizeProgressDialog extends AbstractPanel {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  response?   : FilterOptimizationResponse
  percentage? : number
  gain?       : number

  private poller !: Subscription

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private portfolioService: PortfolioService,
              private dialogRef       : MatDialogRef<OptimizeProgressDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "portfolio.filtering.optimize");
    this.poller = timer(0, 1000).subscribe(
      result => this.refresh()
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  protected override destroy = (): void => {
    this.poller.unsubscribe()
  }

  //-------------------------------------------------------------------------

  onAbort() {
    this.portfolioService.stopFilterOptimization(this.data.tsId).subscribe(
      result => {
        console.log("Filter optimization stopped")
        this.dialogRef.close(true)
      }
    )
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private refresh() {
    this.portfolioService.getFilterOptimizationInfo(this.data.tsId).subscribe(
      result => {
        console.log("Polled")
        this.response = result

        if (this.response.currStep && this.response.maxSteps) {
          this.percentage = Math.floor(this.response.currStep * 100 / this.response.maxSteps)
        }

        if (this.response.baseValue && this.response.bestValue) {
          this.gain = Math.floor((this.response.bestValue / this.response.baseValue -1) * 100)
        }

        if (result.status == "complete"){
          this.dialogRef.close(true)
        }
      }
    )
  }
}

//=============================================================================
