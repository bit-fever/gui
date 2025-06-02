//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from '@angular/core';
import {RightTitlePanel} from "../../../../../../component/panel/right-title/right-title.panel";
import {AbstractPanel}   from "../../../../../../component/abstract.panel";
import {AppEvent} from "../../../../../../model/event";
import {LabelService} from "../../../../../../service/label.service";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgForOf, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {InputTextRequired} from "../../../../../../component/form/input-text-required/input-text-required";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";
import {BrokerProduct} from "../../../../../../model/model";
import {InstrumentSelectorPanel} from "../../../../../../component/form/instrument-selector/instrument-selector.panel";
import {CollectorService} from "../../../../../../service/collector.service";
import {BiasAnalysis, BiasAnalysisFull} from "../model";

//=============================================================================

@Component({
  selector: "biasAnalysis-view",
  templateUrl: './bias-analysis.view.html',
  styleUrls: ['./bias-analysis.view.scss'],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule,
    MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDividerModule, InputTextRequired, SelectRequired, InstrumentSelectorPanel
  ]
})

//=============================================================================

export class BiasAnalysisViewPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ba = new BiasAnalysisFull()

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService,
              private collectorService : CollectorService) {

    super(eventBusService, labelService, router, "tool.biasAnalysis", "biasAnalysis");
    super.subscribeToApp(AppEvent.BIASANALYSIS_VIEW_START, (e : AppEvent) => this.onStart(e));
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("BiasAnalysisViewPanel: Starting...");
    this.ba = Object.assign(new BiasAnalysis(), event.params)
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    super.emitToApp(new AppEvent(AppEvent.RIGHT_PANEL_CLOSE));
  }
}

//=============================================================================
