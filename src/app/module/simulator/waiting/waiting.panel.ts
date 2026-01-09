//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {PortfolioService} from "../../../service/portfolio.service";
import {FlatButton} from "../../../component/form/flat-button/flat-button";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule, ProgressSpinnerMode} from "@angular/material/progress-spinner";
import {SimulationResult} from "../../../model/simulation";
import {IntDateTranscoder} from "../../../component/panel/flex-table/transcoders";
import {PorTradingSystem} from "../../../model/model";

//=============================================================================

@Component({
  selector: "simulation-waiting",
  templateUrl: './waiting.panel.html',
  styleUrls : ['./waiting.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, MatButtonToggleModule, MatIconModule, FlatButton, MatCardModule, MatProgressSpinnerModule]
})

//=============================================================================

export class SimulationWaitingPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  mode: ProgressSpinnerMode = 'determinate';

  @Input() ts?  : PorTradingSystem
  @Input() res? : SimulationResult
  @Output() stopChange = new EventEmitter();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private portfolioService : PortfolioService) {

    super(eventBusService, labelService, router, "module.simulation.waiting");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    console.log("SimulationWaitingPanel: Initializing...")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onStopClick() {
    this.stopChange.emit()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  getMode() : ProgressSpinnerMode {
    if (this.res == undefined) {
      return "indeterminate";
    }

    if (this.res.status == "waiting") {
      return "indeterminate";
    }

    return "determinate";
  }

  //-------------------------------------------------------------------------

  getValue() : number {
    if (this.res?.step) {
      let value = this.res.step * 100 / 6
      return Math.min(value, 100)
    }

    return 0
  }
  //---------------------------------------------------------------------------

  firstTrade () : string {
    return new IntDateTranscoder().transcode(this.res?.firstTradeDate)
  }

  //---------------------------------------------------------------------------

  lastTrade() : string {
    return new IntDateTranscoder().transcode(this.res?.lastTradeDate)
  }
}

//=============================================================================
