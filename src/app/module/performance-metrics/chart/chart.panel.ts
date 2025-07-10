//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexXAxis, ChartComponent} from "ng-apexcharts";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {ToggleButton} from "../../../component/form/toggle-button/toggle-button";
import {PerfEquities, PerformanceAnalysisResponse} from "../../../model/model";
import {ChartOptions} from "../../../lib/chart-lib";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {Setting} from "../../../model/setting";
import {Lib} from "../../../lib/lib";

//=============================================================================

@Component({
  selector: 'performance-chart-panel',
  templateUrl: './chart.panel.html',
  styleUrls: ['./chart.panel.scss'],
  imports: [
    ChartComponent,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    ToggleButton
  ]
})

//=============================================================================

export class PerformanceChartPanel extends AbstractPanel {
  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  @Input()
  set par(par : PerformanceAnalysisResponse) {
    this._par = par
    this.rebuildChart()
  }

  get par() : PerformanceAnalysisResponse|undefined {
    return this._par
  }

  _par? : PerformanceAnalysisResponse

  //---------------------------------------------------------------------------

  tradeType   = new FormControl("all")
  profitType  = new FormControl("all")
  chartType   = new FormControl("time")
  showDrawdown = true
  showSteps    = true

  chartOptions : ChartOptions;

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private localService : LocalService) {
    super(eventBusService, labelService, router, "portfolio.tradingSystem.performance.chart", "")

    this.chartOptions  = this.buildChartOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.tradeType .setValue(this.localService.getItemWithDefault(Setting.Portfolio_TradSys_PerfTrade,  "all"))
    this.profitType.setValue(this.localService.getItemWithDefault(Setting.Portfolio_TradSys_PerfProfit, "all"))
    this.chartType .setValue(this.localService.getItemWithDefault(Setting.Portfolio_TradSys_PerfChart, "time"))

    this.showDrawdown = this.localService.getItemWithDefault(Setting.Portfolio_TradSys_PerfDdown, "true") == "true"

    this.updateChartType()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onTradeTypeChange() {
    let value = this.tradeType.value
    this.localService.setItem(Setting.Portfolio_TradSys_PerfTrade, value)
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onProfitTypeChange() {
    let value = this.profitType.value
    this.localService.setItem(Setting.Portfolio_TradSys_PerfProfit, value)
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onDrawdownChange() {
    this.localService.setItem(Setting.Portfolio_TradSys_PerfDdown, this.showDrawdown+"")
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onChartTypeChange() {
    let value = this.chartType.value
    this.localService.setItem(Setting.Portfolio_TradSys_PerfChart, value)
    this.updateChartType()
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onStepsChange() {
    if (this.showSteps) {
      this.chartOptions.stroke = <ApexStroke>{
        curve: "stepline",
        width: 2,
      }
    }
    else {
      this.chartOptions.stroke = <ApexStroke>{
        curve: "straight",
        width: 2,
      }
    }

    // this.rebuildChart()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildChartOptions() : ChartOptions {
    return {
      title: {
      },
      chart: {
        type: "line",
        height: 500,
        id: "base",
        group: "equity",
        zoom: {
          enabled: true,
          autoScaleYaxis: true,
          allowMouseWheelZoom: false
        }
      },

      series: [],

      plotOptions: {},

      stroke: {
        curve: "stepline",
        width: 2,
      },

      dataLabels: {
      },

      colors: [],

      xaxis: {
        type: "datetime"
      },

      yaxis: {
        decimalsInFloat: 0
      },
      annotations: {},
    }
  }

  //-------------------------------------------------------------------------

  private rebuildChart() {
    let datasets : any[] = []
    let equs = this.getEquities()

    if (equs != undefined) {
      let xAxis = this.getXAxis(equs.time)

      if (this.shouldShowGrossEquity()) {
        datasets = [...datasets, Lib.chart.buildDataset(this.loc("grossEquity"), xAxis, equs.grossProfit, false, "#808080")]
      }

      if (this.shouldShowNetEquity()) {
        datasets = [...datasets, Lib.chart.buildDataset(this.loc("netEquity"), xAxis, equs.netProfit, false, "#008FFB")]
      }

      if (this.showDrawdown) {
        if (this.shouldShowGrossEquity()) {
          datasets = [...datasets, Lib.chart.buildDataset(this.loc("grossDrawdown"), xAxis, equs.grossDrawdown, true)]
        }

        if (this.shouldShowNetEquity()) {
          datasets = [...datasets, Lib.chart.buildDataset(this.loc("netDrawdown"), xAxis, equs.netDrawdown, true)]
        }
      }
    }

    this.chartOptions.series = datasets
  }

  //-------------------------------------------------------------------------

  private getEquities() : PerfEquities|undefined {
    let equs = this._par?.allEquities

    if (this.tradeType.value == "long") {
      equs = this._par?.longEquities
    }
    else if (this.tradeType.value == "short") {
      equs = this._par?.shortEquities
    }

    return equs
  }

  //-------------------------------------------------------------------------

  private shouldShowGrossEquity() : boolean {
    return this.profitType.value == "all" || this.profitType.value == "gross"
  }

  //-------------------------------------------------------------------------

  private shouldShowNetEquity() : boolean {
    return this.profitType.value == "all" || this.profitType.value == "net"
  }

  //-------------------------------------------------------------------------

  private updateChartType() {
    if (this.chartType.value == "trade") {
      this.chartOptions.xaxis = <ApexXAxis>{
        type:"numeric"
      }
    }
    else {
      this.chartOptions.xaxis = <ApexXAxis>{
        type:"datetime"
      }
    }
  }

  //-------------------------------------------------------------------------

  private getXAxis(time : Date[]) : any[] {
    if (this.chartType.value == "time") {
      return time
    }

    let axis : number[] = new Array(time.length)
    for (let i=0; i<axis.length; i++) {
      axis[i] = i+1
    }

    return axis
  }
}

//=============================================================================
