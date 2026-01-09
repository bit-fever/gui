//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {SelectRequired} from "../../../component/form/select-required/select-required";
import {AbstractPanel} from "../../../component/abstract.panel";
import {SimulationRequest} from "../../../model/simulation";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {FlatButton} from "../../../component/form/flat-button/flat-button";
import {InputNumberRequired} from "../../../component/form/input-integer-required/input-number-required";
import {MatCardModule} from "@angular/material/card";
import {PorTradingSystem} from "../../../model/model";

//=============================================================================

@Component({
  selector: "simulation-params",
  templateUrl: './params.panel.html',
  styleUrls : ['./params.panel.scss'],
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, MatButtonToggleModule, MatIconModule, SelectRequired, FlatButton, InputNumberRequired, MatCardModule]
})

//=============================================================================

export class SimulationParamsPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  selectedPeriod : number = 0
  periods        : any


  @Input() ts? : PorTradingSystem
  @Input() req : SimulationRequest = new SimulationRequest()

  @Output() runChange = new EventEmitter<SimulationRequest>();

  @ViewChild("tsRunsCtrl")    tsRunsCtrl?    : InputNumberRequired
  @ViewChild("tsCapitalCtrl") tsCapitalCtrl? : InputNumberRequired
  @ViewChild("tsRuinPerCtrl") tsRuinPerCtrl? : InputNumberRequired

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService  : EventBusService,
              labelService     : LabelService,
              router           : Router) {

    super(eventBusService, labelService, router, "module.simulation.params");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    console.log("SimulationParamsPanel: Initializing...")
    this.periods = this.labelMap("periods");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRunClick() : void {
    this.runChange.emit(this.req);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  getRuinAmount() : number {
    let capital = this.req.initialCapital
    let ruinPerc= this.req.ruinPercentage

    let res = Math.trunc(capital * ruinPerc / 100)

    return Number.isNaN(res) ? 0 : res
  }

  //-------------------------------------------------------------------------

  runEnabled() : boolean {
    let result =
          this.tsRunsCtrl?.isValid() &&
          this.tsCapitalCtrl?.isValid() &&
          this.tsRuinPerCtrl?.isValid()

    return result == undefined ? false : result
  }
}

//=============================================================================
