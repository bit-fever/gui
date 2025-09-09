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
import {DataInstrumentExt, DataProductExt, DIEStatus} from "../../../../../../model/model";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../../service/label.service";
import {EventBusService}      from "../../../../../../service/eventbus.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {AppEvent} from "../../../../../../model/event";
import {Observable} from "rxjs";
import {InventoryService} from "../../../../../../service/inventory.service";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {InstrumentUploadDialog} from "./instrument-upload.dialog";
import {
  FlagStyler, InstrumentStatusStyler,
  IntDateTranscoder, IsoDateTranscoder,
} from "../../../../../../component/panel/flex-table/transcoders";
import {CollectorService} from "../../../../../../service/collector.service";
import {Url} from "../../../../../../model/urls";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {Setting} from "../../../../../../model/setting";
import {LocalService} from "../../../../../../service/local.service";

//=============================================================================

@Component({
    selector: 'productData-view',
    templateUrl: './product-data.view.html',
    styleUrls: ['./product-data.view.scss'],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
    RouterModule, FlexTablePanel, MatTabsModule, MatDialogModule, MatButtonToggleModule, ReactiveFormsModule]
})

//=============================================================================

export class InvDataProductViewPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  pdId : number         = 0
  pd   : DataProductExt = new DataProductExt()

  market   : string = ""
  product  : string = ""
  columns  : FlexTableColumn[] = [];
  service? : ListService<DataInstrumentExt>;
  disChart : boolean = false;
  disData  : boolean = true;
  selInstr?: number

  selContractType = new FormControl("*")
  selStatusType   = new FormControl("*")

  @ViewChild("table") table : FlexTablePanel<DataInstrumentExt>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private route           : ActivatedRoute,
              private inventoryService: InventoryService,
              private collectorService: CollectorService,
              private localService    : LocalService,
              public  dialog          : MatDialog) {

    super(eventBusService, labelService, router, "inventory.dataProduct", "dataProduct");

    eventBusService.subscribeToApp(AppEvent.DATAINSTRUMENT_LIST_RELOAD, () => {
      this.table?.reload()
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  private getInstruments = (): Observable<ListResponse<DataInstrumentExt>> => {
    return this.collectorService.getDataInstrumentsByProductId(this.pdId);
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
    this.pdId    = Number(this.route.snapshot.paramMap.get("id"));
    this.service = this.getInstruments;

    this.selStatusType.setValue(this.localService.getItemWithDefault(Setting.Inventory_DataProd_Status, "*"))

    this.inventoryService.getDataProductById(this.pdId, true).subscribe(
      result => {
        this.pd = result
        this.market   = this.labelService.getLabelString("map.market." +this.pd.marketType)
        this.product  = this.labelService.getLabelString("map.product."+this.pd.productType)
      }
    )
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : DataInstrumentExt[]) {
    if (selection.length == 1) {
      this.selInstr = selection[0].id
      this.disData  = false
    }
    else {
      this.selInstr = undefined
      this.disData  = true
    }
  }

  //-------------------------------------------------------------------------

  onUploadClick() {
    const dialogRef = this.dialog.open(InstrumentUploadDialog, {
      minWidth: "1024px",
      data: {
        dataProduct : this.pd
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.table?.reload()
      }
    })
  }

  //-------------------------------------------------------------------------

  onChartClick() {
    this.navigateTo([ Url.Inventory_DataProducts, this.pdId, Url.Sub_Chart ]);
  }

  //-------------------------------------------------------------------------

  onDataClick() {
    this.navigateTo([ Url.Inventory_DataInstruments, this.selInstr, Url.Sub_Data ]);
  }

  //-------------------------------------------------------------------------

  onFilterChange() {
    let value = this.selStatusType.value
    this.localService.setItem(Setting.Inventory_DataProd_Status, value)
    this.table?.applyFilter()
  }

  //-------------------------------------------------------------------------
  //--- Filter
  //-------------------------------------------------------------------------

  tableFilter = (row : DataInstrumentExt, filter : string) : boolean => {
      // @ts-ignore
    return this.typeFilter(row) && this.statusFilter(row) && this.table?.defaultFilter(row, filter)
  }

  //-------------------------------------------------------------------------

  private typeFilter(row : DataInstrumentExt) : boolean {
    let type = this.selContractType.value

    if (type=="*") {
      return true
    }

    if (type == "reg" && !row.continuous) {
      return true
    }

    if (type == "cont" && row.continuous) {
      return true
    }

    return false
  }

  //-------------------------------------------------------------------------

  private statusFilter(row : DataInstrumentExt) : boolean {
    let type = this.selStatusType.value

    if (type=="*") {
      return true
    }

    if (type == "stor") {
      return row.status != undefined
    }

    if (type == "bad") {
      return row.status == DIEStatus.Empty || row.status == DIEStatus.Error
    }

    return false
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.dataInstrument");

    this.columns = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "expirationDate", new IsoDateTranscoder()),
      new FlexTableColumn(ts, "continuous", undefined, new FlagStyler()),
      new FlexTableColumn(ts, "dataFrom", new IntDateTranscoder()),
      new FlexTableColumn(ts, "dataTo", new IntDateTranscoder()),
      new FlexTableColumn(ts, "status", undefined, new InstrumentStatusStyler()),
      new FlexTableColumn(ts, "progress"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
