//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {InvTradingSystemFull, DataProduct, BiasAnalysisFull} from "../../../../../model/model";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {Router, RouterModule} from "@angular/router";
import {Url} from "../../../../../model/urls";
import {AppEvent} from "../../../../../model/event";
import {Observable} from "rxjs";
import {InventoryService} from "../../../../../service/inventory.service";
import {LabelTranscoder} from "../../../../../component/panel/flex-table/transcoders";
import {CollectorService} from "../../../../../service/collector.service";

//=============================================================================

@Component({
  selector    :     'bias-analysis',
  templateUrl :   './bias-analysis.list.html',
  styleUrls   : [ './bias-analysis.list.scss' ],
  imports     : [ CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
    RouterModule, FlexTablePanel],
  standalone  : true
})

//=============================================================================

export class BiasAnalisysListPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns  : FlexTableColumn[] = [];
  service  : ListService<BiasAnalysisFull>;
  disCreate: boolean = false;
  disView  : boolean = true;
  disEdit  : boolean = true;
  disAnal  : boolean = true;

  @ViewChild("table") table : FlexTablePanel<BiasAnalysisFull>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private collectorService: CollectorService) {

    super(eventBusService, labelService, router, "tool.biasAnalysis");

    this.service = this.getBiasAnalyses;

    eventBusService.subscribeToApp(AppEvent.BIASANALYSIS_LIST_RELOAD, () => {
      this.table?.reload()
      this.updateButtons([])
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  private getBiasAnalyses = (): Observable<ListResponse<BiasAnalysisFull>> => {
    return this.collectorService.getBiasAnalyses(true);
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : BiasAnalysisFull[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Tool_BiasAnalyses, Url.Right_BiasAnalysis_Create, AppEvent.BIASANALYSIS_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.navigateTo([ Url.Tool_BiasAnalyses, selection[0].id ]);
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();
    this.openRightPanel(Url.Tool_BiasAnalyses, Url.Right_BiasAnalysis_Edit, AppEvent.BIASANALYSIS_EDIT_START, selection[0]);
  }

  //-------------------------------------------------------------------------

  onAnalyzeClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    this.navigateTo([ Url.Tool_BiasAnalyses, selection[0].id, Url.Sub_Summary ]);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.biasAnalysis");

    this.columns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "dataSymbol"),
      new FlexTableColumn(ts, "dataName"),
      new FlexTableColumn(ts, "brokerSymbol"),
      new FlexTableColumn(ts, "brokerName"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : BiasAnalysisFull[]) => {
    this.disView = (selection.length != 1)
    this.disEdit = (selection.length != 1)
    this.disAnal = (selection.length != 1)
  }
}

//=============================================================================