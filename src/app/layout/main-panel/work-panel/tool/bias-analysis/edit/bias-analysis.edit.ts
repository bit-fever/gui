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
import {BiasAnalysis} from "../model";

//=============================================================================

@Component({
    selector: "biasAnalysis-edit",
    templateUrl: './bias-analysis.edit.html',
    styleUrls: ['./bias-analysis.edit.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule,
        MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
        MatDividerModule, InputTextRequired, SelectRequired, InstrumentSelectorPanel
    ]
})

//=============================================================================

export class BiasAnalysisEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  ba = new BiasAnalysis()

  products : BrokerProduct[] = []

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
    super.subscribeToApp(AppEvent.BIASANALYSIS_EDIT_START, (e : AppEvent) => this.onStart(e));

    inventoryService.getBrokerProducts(false).subscribe(
      result => {
        this.products = result.result;
      })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
    console.log("BiasAnalysisEditPanel: Starting...");
    this.ba = Object.assign(new BiasAnalysis(), event.params)
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.ba.name             != undefined &&
            this.ba.dataInstrumentId != undefined &&
            this.ba.brokerProductId  != undefined
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    this.collectorService.updateBiasAnalysis(this.ba).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.BIASANALYSIS_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
    super.emitToApp(new AppEvent(AppEvent.RIGHT_PANEL_CLOSE));
  }
}

//=============================================================================
