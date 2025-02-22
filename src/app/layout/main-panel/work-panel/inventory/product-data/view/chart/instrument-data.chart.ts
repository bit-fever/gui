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
import {MatSelectModule} from "@angular/material/select";
import {DataPoint, DataInstrument, DataInstrumentDataResponse} from "../../../../../../../model/model";
import {FlexTableColumn, ListResponse, ListService} from "../../../../../../../model/flex-table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {SelectRequired} from "../../../../../../../component/form/select-required/select-required";
import {DatePicker} from "../../../../../../../component/form/date-picker/date-picker";
import {Observable} from "rxjs";
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexStroke,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexDataLabels, ChartComponent,
} from "ng-apexcharts";

//=============================================================================

export type ChartOptions = {
  series     : ApexAxisChartSeries;
  chart      : ApexChart;
  xaxis      : ApexXAxis;
  yaxis      : ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels : ApexDataLabels;
  stroke     : ApexStroke;
};

//=============================================================================

@Component({
  selector    :     'instrumentData-chart',
  templateUrl :   './instrument-data.chart.html',
  styleUrls   : [ './instrument-data.chart.scss' ],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
            RouterModule, FlexTablePanel, MatChipsModule, MatSelectModule, SelectRequired,
            DatePicker, NgApexchartsModule],
  standalone  : true
})

//=============================================================================

export class DataInstrumentChartPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  pdId : number = 0

  fromDate      : number|null = null
  toDate        : number|null = null
  timeframe     : string = "60m"
  timezone      : string = "exchange"
  instrumentIds : number[] = [];
  minPeriod     : number|undefined
  maxPeriod     : number|undefined

  columns         : FlexTableColumn[] = [];
  service?        : ListService<DataInstrument>;
  serviceResponse?: DataInstrumentDataResponse

  timeframes: any
  timezones : any

  // @ts-ignore
  @ViewChild("instrTable") flexTable : FlexTablePanel;
  // @ts-ignore
  @ViewChild("timeframeCtrl") timeframeCtrl : SelectRequired;
  // @ts-ignore
  @ViewChild("smallChart", { static: false}) smallChartCtrl : ChartComponent;

  mainChartOptions  : ChartOptions;
  smallChartOptions : ChartOptions;
  reduction         : number = 1200

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

    super(eventBusService, labelService, router, "inventory.dataProduct.chart");

    this.mainChartOptions  = this.buildMainChartOptions()
    this.smallChartOptions = this.buildSmallChartOptions()
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

        this.timezones = [ exchange, ...result.result]
      }
    )
  }

  //-------------------------------------------------------------------------

  private getInstruments = (): Observable<ListResponse<DataInstrument>> => {
    return this.collectorService.getDataInstrumentsByProductId(this.pdId);
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : DataInstrument[]) {
    // @ts-ignore
    this.instrumentIds = selection.map( instr => instr.id);
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onTimeframeChange(value: string) {
    this.timeframe = value;
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onTimezoneChange(value: string) {
    this.timezone = value;
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onFromChange(value:number|null) {
    this.reload(true)
  }

  //-------------------------------------------------------------------------

  onToChange(value:number|null) {
    this.reload(true)
  }

  //-------------------------------------------------------------------------

  drillStyle() : string {
    if (this.serviceResponse == undefined) {
      return "#808080"
    }

    if (this.serviceResponse.reduced) {
      return "#F08000"
    }

    return "#00A080"
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private setupColumns = () => {
    let instr = this.labelService.getLabel("model.dataInstrument");

    this.columns = [
      new FlexTableColumn(instr, "symbol"),
    ]
  }

  //-------------------------------------------------------------------------

  private reload = (callService : boolean) => {
    this.destroyChart();

    if (this.instrumentIds.length == 0) {
      return;
    }

    if (callService) {
      this.collectorService.getDataInstrumentData(this.instrumentIds[0],
                                                  this.buildDate(this.fromDate, false),
                                                  this.buildDate(this.toDate, true),
                                                  this.timeframe, this.timezone,
                                                  this.reduction).subscribe(
        result => {
          this.serviceResponse = result;
          this.createChart()
        }
      )
    }
  }

  //-------------------------------------------------------------------------

  private createChart() {
    this.mainChartOptions.series = [{
        name: 'XXX',
        data: this.buildMainDataset(this.serviceResponse?.dataPoints)
    }]

    this.smallChartOptions.series = [{
        name: 'Up volume',
        data: this.buildSmallDatasetUp(this.serviceResponse?.dataPoints)
      },
      {
        name: 'Down volume',
        data: this.buildSmallDatasetDown(this.serviceResponse?.dataPoints)
      }
    ]
  }

  //-------------------------------------------------------------------------

  private destroyChart() {
    this.mainChartOptions.series  = []
    this.smallChartOptions.series = []
    this.minPeriod       = undefined
    this.maxPeriod       = undefined
    this.serviceResponse = undefined
  }

  //-------------------------------------------------------------------------

  private buildDate(value : number|null, isEnd : boolean) : string {
    if (value == undefined) {
      return ""
    }

    let v=value.toString()

    let y= v.substring(0,4)
    let m= v.substring(4,6)
    let d= v.substring(6)

    let suffix = isEnd ? " 23:59:59" :" 00:00:00"

    return y +"-"+ m +"-"+ d +suffix
  }

  //-------------------------------------------------------------------------

  private zoomedHandler = (chart: any, options?: any) => {
    this.fromDate = this.convertDate(options.xaxis.min)
    this.toDate = this.convertDate(options.xaxis.max)

    this.reload(true)

    return {
      xaxis: {
        min: undefined,
        max: undefined
      }
    }
  }

  //-------------------------------------------------------------------------

  private convertDate(value : number) : number|null {
    let s = new Date(value).toISOString()

    return Number(s.substring(0,10).replace("-", "").replace("-", ""))
  }

  //-------------------------------------------------------------------------
  //--- Main chart
  //-------------------------------------------------------------------------

  private buildMainChartOptions() : ChartOptions {
    return {
      series: [{
          data: []
        }
      ],
      chart: {
        type: "candlestick",
        id: 'main',
        height: 600,
        group: 'priceSet',
        events: {
          beforeZoom: this.zoomedHandler
          // zoomed: this.zoomedHandler
        }
      },
      dataLabels: {},
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#00B080",
            downward: "#F03040"
          }
        }
      },
      stroke: {},
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: true,
          formatter: this.mainTooltip
        }
      },
      yaxis: {}
    };
  }

  //-------------------------------------------------------------------------

  private buildMainDataset(dataPoints : DataPoint[]|undefined) {
    if (dataPoints == undefined) {
      return []
    }

    return dataPoints.map( (dp, index, array) => {
      return {
        x: new Date(dp.time),
        y: [dp.open, dp.high, dp.low, dp.close ]
      }
    })
  }

  //-------------------------------------------------------------------------

  private mainTooltip = (value: string, opts?: any): string => {
  let tip = ""

    if (opts != undefined) {
      let idx = opts["dataPointIndex"]
      let dp = this.serviceResponse?.dataPoints[idx]

      let date = dp?.time.substring(0, 10)
      let time = dp?.time.substring(11,16)
      let tz   = dp?.time.substring(19)

      tip = date +"<br/>"+ time + "<br/>"+ tz
    }

    return tip
  }

  //-------------------------------------------------------------------------
  //--- Volume chart
  //-------------------------------------------------------------------------

  private buildSmallChartOptions() : ChartOptions {
    return {
      series: [
        {
          data: []
        }
      ],
      chart: {
        type: 'bar',
        id: 'small',
        height: 200,
        group: 'priceSet',
        stacked: true,
        events: {
          zoomed: this.zoomedHandler
        }
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          columnWidth: '80%',
          colors: {
            ranges: [{
                from: 0,
                color: '#FEB019'
              }
            ]
          }
        }
      },
      stroke: {
        width: 0
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {}
    };
  }

  //-------------------------------------------------------------------------

  private buildSmallDatasetUp(dataPoints : DataPoint[]|undefined) {
    if (dataPoints == undefined) {
      return []
    }

    return dataPoints.map( (dp, index, array) => {
      return {
        x: new Date(dp.time),
        y:  dp.upVolume
      }
    })
  }

  //-------------------------------------------------------------------------

  private buildSmallDatasetDown(dataPoints : DataPoint[]|undefined) {
    if (dataPoints == undefined) {
      return []
    }

    return dataPoints.map( (dp, index, array) => {
      return {
        x: new Date(dp.time),
        y:  -dp.downVolume
      }
    })
  }
}

//=============================================================================
