//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {LocalService} from "../../../../../../service/local.service";
import {InventoryService} from "../../../../../../service/inventory.service";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {InvTradingSystemFull} from "../../../../../../model/model";
import {AppEvent} from "../../../../../../model/event";
import {Url} from "../../../../../../model/urls";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {BroadcastService} from "../../../../../../service/broadcast.service";
import {ModuleService} from "../../../../../../service/module.service";

//=============================================================================

@Component({
    selector: 'development-panel',
    templateUrl: './development.panel.html',
    styleUrls: ['./development.panel.scss'],
    imports: [CommonModule, RouterModule, MatTabsModule, ReactiveFormsModule, FormsModule, FlexTablePanel, MatButton, MatFormField, MatIcon, MatIconButton, MatInput, MatLabel, MatSuffix]
})

//=============================================================================

export class DevelopmentPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  _filter = ""

  columns    : FlexTableColumn[] = [];
  disCreate  : boolean = false
  disView    : boolean = true
  disEdit    : boolean = true
  disDelete  : boolean = true
  disFinalize: boolean = true

  tradingSystems : InvTradingSystemFull[] = []

  private tradingSystemsOrig : InvTradingSystemFull[] = []

  @ViewChild("table") table : FlexTablePanel<InvTradingSystemFull>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private snackBar        : MatSnackBar,
              private inventoryService: InventoryService,
              private storageService  : LocalService,
              private moduleService   : ModuleService,
              private broadcastService: BroadcastService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem.development");

    eventBusService.subscribeToApp(AppEvent.TRADINGSYSTEM_DEVEL_LIST_RELOAD, () => {
      this.reload()
      this.updateButtons([])
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
    this.reload()
  }

  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.tradingSystem");

    this.columns = [
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "dataSymbol"),
      new FlexTableColumn(ts, "brokerSymbol"),
      new FlexTableColumn(ts, "timeframe"),
      new FlexTableColumn(ts, "type"),
      new FlexTableColumn(ts, "overnight"),
      new FlexTableColumn(ts, "tradingSession"),
    ]
  }

  //-------------------------------------------------------------------------

  override destroy = () : void => {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  get filter() : string {
    return this._filter
  }

  //-------------------------------------------------------------------------

  @Input()
  set filter(value : string) {
    this._filter = value
    this.rebuildTSList()
  }

  //-------------------------------------------------------------------------

  reload() {
    console.log("Reloading...")

    this.tradingSystemsOrig = []
    this.tradingSystems     = []
    this.table?.clearSelection()

    this.inventoryService.getTradingSystems(true).subscribe( res => {
      this.tradingSystemsOrig = res.result
      this.rebuildTSList()
    });
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : InvTradingSystemFull[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Portfolio_TradingSystems, Url.Right_TradingSystem_DevelEdit, AppEvent.TRADINGSYSTEM_DEVEL_EDIT_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      console.log(JSON.stringify(selection))
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();
    this.openRightPanel(Url.Portfolio_TradingSystems, Url.Right_TradingSystem_DevelEdit, AppEvent.TRADINGSYSTEM_DEVEL_EDIT_START, selection[0]);
  }

  //-------------------------------------------------------------------------

  onDeleteClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    for (let i=0; i<selection.length; i++) {
      let id = selection[i].id
      // @ts-ignore
      this.inventoryService.deleteTradingSystem(id).subscribe( res => {
        this.broadcastService.sendTradingSystemDeleted(res.id)
        this.reload()
      })
    }
  }

  //-------------------------------------------------------------------------

  onFinalizeClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    for (let i=0; i<selection.length; i++) {
      let id = selection[i].id
      // @ts-ignore
      this.inventoryService.finalizeTradingSystem(id).subscribe( res => {
        this.reload()
      })
    }
  }

  //-------------------------------------------------------------------------

  onDocumentClick() {
    // @ts-ignore
    let tsId = this.table.getSelection()[0].id;
    if (tsId != undefined) {
      this.moduleService.openDocEditor(tsId)
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : InvTradingSystemFull[]) => {
    this.disView    = (selection.length != 1)
    this.disEdit    = (selection.length != 1)
    this.disDelete  = (selection.length == 0)
    this.disFinalize= (selection.length == 0)
  }

  //-------------------------------------------------------------------------

  private rebuildTSList() {
    this.tradingSystems = this.tradingSystemsOrig.filter(ts => {
      return (!ts.finalized && this.runFilter(ts))
    })
  }

  //-------------------------------------------------------------------------
  //--- Filtering
  //-------------------------------------------------------------------------

  private runFilter = (ts : InvTradingSystemFull) : boolean => {
    return this.filterText(ts, this._filter)
  }

  //-------------------------------------------------------------------------

  private filterText(ts : InvTradingSystemFull, filter : string) : boolean {
    let name = ts.name?.trim().toLowerCase()
    if (name?.length == 0) {
      return true
    }

    return name?.indexOf(filter) != -1
  }
}

//=============================================================================
