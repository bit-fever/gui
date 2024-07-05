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
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {FlexTablePanel} from "../../../../../../../component/panel/flex-table/flex-table.panel";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {InventoryService} from "../../../../../../../service/inventory.service";
import {CollectorService} from "../../../../../../../service/collector.service";
import {MatChipsModule} from "@angular/material/chips";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {InstrumentData} from "../../../../../../../model/model";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../../../model/flex-table";
import {ChartOptions} from "../../../../portfolio/monitoring/model";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SelectTextRequired} from "../../../../../../../component/form/select-required/select-text-required";
import {DatePicker} from "../../../../../../../component/form/date-picker/date-picker";
import {Observable} from "rxjs";

//=============================================================================

@Component({
  selector    :     'instrumentData-chart',
  templateUrl :   './instrument-data.chart.html',
  styleUrls   : [ './instrument-data.chart.scss' ],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
    RouterModule, FlexTablePanel, MatChipsModule, MatSelectModule, SelectTextRequired, DatePicker],
  standalone  : true
})

//=============================================================================

export class InstrumentDataChartPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------
  pdId : number         = 0

  fromDate : number|null = null
  toDate   : number|null = null

  instrumentData: InstrumentData[] = [];
  service?      : ListService<InstrumentData>;

  timeframes: any
  timezones : any

  selectedTimeframe: string = "30m"
  selectedTimezone : string = "exc"
  selectedIds      : number[] = [];
  columns          : FlexTableColumn[] = [];
  chart            : any

  options = new ChartOptions();

  // @ts-ignore
  @ViewChild("instrTable") flexTable : FlexTablePanel;

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
              private collectorService: CollectorService) {

    super(eventBusService, labelService, router, "inventory.productData.chart");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
    this.timeframes = this.labelService.getLabel("map.timeframe");
    this.timezones  = this.labelService.getLabel("map.uploadTimezone");

    this.pdId    = Number(this.route.snapshot.paramMap.get("id"));
    this.service = this.getInstrumentData;
  }

  //-------------------------------------------------------------------------

  private getInstrumentData = (): Observable<ListResponse<InstrumentData>> => {
    return this.collectorService.getInstrumentsByDataId(this.pdId);
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : InstrumentData[]) {
    // @ts-ignore
    this.selectedIds = selection.map( instr => instr.id);
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onTimeframeChange(e: MatSelectChange) {
    this.selectedTimeframe = e.value;
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onTimezoneChange(e: MatSelectChange) {
    this.selectedTimezone = e.value;
    this.reload(true);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private reload = (callService : boolean) => {
    this.destroyChart();

    if (this.selectedIds.length == 0) {
      return;
    }

    if (callService) {
    //   this.portfolioService.getPortfolioMonitoring(this.selectedIds, this.selectedPeriod).subscribe(
    //     result => {
    //       this.serviceResponse = result;
    //       this.chart = createChart(this.options, result);
    //     }
    //   )
    // }
    // else if (this.serviceResponse != null) {
    //   this.chart = createChart(this.options, this.serviceResponse);
    }
  }

  //-------------------------------------------------------------------------

  private setupColumns = () => {
    let instr = this.labelService.getLabel("model.instrumentData");

    this.columns = [
      new FlexTableColumn(instr, "symbol"),
    ]
  }

  //-------------------------------------------------------------------------

  private destroyChart() {
    if (this.chart != undefined) {
      this.chart.destroy();
      this.chart = undefined;
    }
  }

}

//=============================================================================
