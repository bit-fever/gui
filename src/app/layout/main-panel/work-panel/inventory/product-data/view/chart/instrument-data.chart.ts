//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {AfterViewInit, Component, ViewChild} from '@angular/core';
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
import {MatSelectModule} from "@angular/material/select";
import {DataPoint, InstrumentData, InstrumentDataResponse} from "../../../../../../../model/model";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../../../model/flex-table";
import {ChartOptions} from "../../../../portfolio/monitoring/model";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SelectTextRequired} from "../../../../../../../component/form/select-required/select-text-required";
import {DatePicker} from "../../../../../../../component/form/date-picker/date-picker";
import {Observable} from "rxjs";
import * as ApexCharts from 'apexcharts';

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

  pdId : number = 0

  fromDate : number|null = null
  toDate   : number|null = null

  instrumentData: InstrumentData[] = [];
  service?      : ListService<InstrumentData>;

  timeframes: any
  timezones : any

  selectedTimeframe: string = "60m"
  selectedTimezone : string = "exchange"
  selectedIds      : number[] = [];
  columns          : FlexTableColumn[] = [];
  chart            : ApexCharts|undefined
  options = new ChartOptions();

  serviceResponse?: InstrumentDataResponse

  // @ts-ignore
  @ViewChild("instrTable") flexTable : FlexTablePanel;
  // @ts-ignore
  @ViewChild("timeframeCtrl") timeframeCtrl : SelectTextRequired;

  reduction : number = 2000

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

    this.pdId    = Number(this.route.snapshot.paramMap.get("id"));
    this.service = this.getInstruments;

    this.inventoryService.getExchanges().subscribe(
      result => {
        let exchange = {
          timezone : "exchange",
          code     : this.loc("exchange")
        }

        this.timezones = result.result
        this.timezones = [ exchange, ...this.timezones]
      }
    )
  }

  //-------------------------------------------------------------------------

  private getInstruments = (): Observable<ListResponse<InstrumentData>> => {
    return this.collectorService.getInstrumentsByProductId(this.pdId);
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : InstrumentData[]) {
    // @ts-ignore
    this.selectedIds = selection.map( instr => instr.id);
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onTimeframeChange(value: string) {
    this.selectedTimeframe = value;
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onTimezoneChange(value: string) {
    this.selectedTimezone = value;
    this.reload(true);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private setupColumns = () => {
    let instr = this.labelService.getLabel("model.instrumentData");

    this.columns = [
      new FlexTableColumn(instr, "symbol"),
    ]
  }

  //-------------------------------------------------------------------------

  private reload = (callService : boolean) => {
    this.destroyChart();

    if (this.selectedIds.length == 0) {
      return;
    }

    if (callService) {
      this.collectorService.getInstrumentData(this.selectedIds[0], "", "", this.selectedTimeframe, this.selectedTimezone, this.reduction).subscribe(
        result => {
          this.serviceResponse = result;
          this.createChart()
        }
      )
    }
    // else if (this.serviceResponse != null) {
    //   this.chart = createChart(this.options, this.serviceResponse);
    // }
  }

  //-------------------------------------------------------------------------

  private createChart() {
    var options = {
      chart: {
        type: "candlestick",
        height: 500,
        id: "main",
        toolbar: {
          autoSelected: 'pan',
          show: false
        },
        zoom: {
          enabled: false
        },
      },
      // title: {
      //   text: "AAA",
      //   align: "left",
      // },
      series: [{
        name: 'Total Views',
        data: this.buildMainDataset(this.serviceResponse?.dataPoints)
      }],
      xaxis: {
        labels: {
          // formatter: function(value:string, timestamp:number, opts:any) {
          //   return new Date(timestamp).toISOString()
          // }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#DF7D46'
          }
        }
      },
    };

    this.chart = new ApexCharts(document.querySelector("#mainChart"), options);
    this.chart.render();





    var optionsSmall= {
      series: [{
        name: 'Range',
        data: this.buildSmallDataset(this.serviceResponse?.dataPoints)
      }],
      chart: {
        height: 200,
        type: 'rangeArea',
        brush: {
          enabled: true,
          target: 'main'
        },
        selection: {
          enabled: true,
          fill: {
            color: '#ccc',
            opacity: 0.4
          },
          stroke: {
            color: '#0D47A1',
          }
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        labels: {
          show: false
        }
      }
    };

    var chartBar = new ApexCharts(document.querySelector("#smallChart"), optionsSmall);
    chartBar.render();
  }

  //-------------------------------------------------------------------------

  private destroyChart() {
    this.chart?.destroy()
  }

  //-------------------------------------------------------------------------

  private buildMainDataset(dataPoints : DataPoint[]|undefined) {
    return dataPoints?.map( (dp, index, array) => {
      return {
        x: new Date(dp.time),
        y: [dp.open, dp.high, dp.low, dp.close ]
      }
    })
  }

  //-------------------------------------------------------------------------

  private buildSmallDataset(dataPoints : DataPoint[]|undefined) {
    return dataPoints?.map( (dp, index, array) : {} => {
      return {
        x: dp.time.substring(0,10),
        y:  [ dp.low, dp.high ]
      }
    })
  }
}

//=============================================================================
