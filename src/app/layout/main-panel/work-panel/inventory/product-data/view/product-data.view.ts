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
import {DataInstrument, DataProduct, DataProductExt} from "../../../../../../model/model";
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
  IntDateTranscoder,
} from "../../../../../../component/panel/flex-table/transcoders";
import {CollectorService} from "../../../../../../service/collector.service";
import {Url} from "../../../../../../model/urls";

//=============================================================================

@Component({
    selector: 'productData-view',
    templateUrl: './product-data.view.html',
    styleUrls: ['./product-data.view.scss'],
    imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
        RouterModule, FlexTablePanel, MatTabsModule, MatDialogModule]
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
  service? : ListService<DataInstrument>;
  disChart : boolean = false;
  disData  : boolean = true;
  selInstr?: number

  @ViewChild("table") table : FlexTablePanel<DataInstrument>|null = null;

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

  private getInstruments = (): Observable<ListResponse<DataInstrument>> => {
    return this.collectorService.getDataInstrumentsByProductId(this.pdId);
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
    this.pdId    = Number(this.route.snapshot.paramMap.get("id"));
    this.service = this.getInstruments;

    this.inventoryService.getDataProductById(this.pdId, true).subscribe(
      result => {
        this.pd = result
        this.market   = this.labelService.getLabelString("map.market." +this.pd.marketType)
        this.product  = this.labelService.getLabelString("map.product."+this.pd.productType)
      }
    )
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : DataInstrument[]) {
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
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.dataInstrument");

    this.columns = [
      new FlexTableColumn(ts, "symbol"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "expirationDate", new IntDateTranscoder()),
      new FlexTableColumn(ts, "isContinuous", undefined, new FlagStyler()),
      new FlexTableColumn(ts, "dataFrom", new IntDateTranscoder()),
      new FlexTableColumn(ts, "dataTo", new IntDateTranscoder()),
      new FlexTableColumn(ts, "status", undefined, new InstrumentStatusStyler()),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
