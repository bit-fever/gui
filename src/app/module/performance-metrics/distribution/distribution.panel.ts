//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {
  ApexPlotOptions,
  ChartComponent
} from "ng-apexcharts";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {ChartOptions} from "../../../lib/chart-lib";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {Setting} from "../../../model/setting";
import {Distribution, PerformanceAnalysisResponse} from "../../../model/performance";

//=============================================================================

@Component({
  selector: 'performance-distribution-panel',
  templateUrl: './distribution.panel.html',
  styleUrls:  ['./distribution.panel.scss'],
  imports: [
    ChartComponent,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
  ]
})

//=============================================================================

export class PerformanceDistributionPanel extends AbstractPanel {
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

  chartType   = new FormControl("trades")
  tradeType   = new FormControl("all")
  profitType  = new FormControl("net")

  chartOptions : ChartOptions;
  selDistrib?  : Distribution

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private localService : LocalService) {
    super(eventBusService, labelService, router, "module.performance.distribution", "")

    this.chartOptions  = this.buildChartOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.chartType.setValue(this.localService.getItemWithDefault(Setting.Portfolio_TradSys_PerfDistrib, "daily"))
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  isDaily() : boolean {
    return this.chartType.value == "daily"
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onChartTypeChange() {
    let value = this.chartType.value
    this.localService.setItem(Setting.Portfolio_TradSys_PerfDistrib, value)
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onTradeTypeChange() {
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onProfitTypeChange() {
    this.rebuildChart()
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
        type: "bar",
        height: "96%",
      },

      series: [],

      legend: {
        show: false
      },

      plotOptions: {
        bar: {
          columnWidth: "95%",
        }
      },

      stroke: {
        curve: "monotoneCubic",
        width: 2,
        dashArray: [ 0, 4, 0, 4 ]
      },

      dataLabels: {
        enabled: false,
//        formatter: this.countFormatter
      },

      colors: [ "#008FFB", "#808080"],

      xaxis: {},

      yaxis: {
        decimalsInFloat: 0,
        title: {
          text: this.loc("returnsDistr")
        }
      },
      annotations: {},
      labels: [],
      grid: {}
    }
  }

  //-------------------------------------------------------------------------

  private rebuildChart() {
    this.selDistrib = this.selectDistribution()

    let datasets = this.selDistrib?.histogram?.bars
    if (datasets == undefined) {
      datasets = []
    }

    let gaussian = this.selDistrib?.histogram?.gaussian
    if (gaussian == undefined) {
      gaussian = []
    }

    this.chartOptions.series = [{
      name: this.loc("count"),
      data: datasets,
    },
    {
      type:"line",
      data: gaussian
    }
    ]

    this.chartOptions.xaxis = {
      type: "category",
      categories: this.buildCategories()
    }

    this.chartOptions.plotOptions = <ApexPlotOptions>{
      bar: {
        columnWidth: "100%",
        colors: {
          backgroundBarColors: this.buildColors(),
          backgroundBarOpacity: 0.2,
        }
      }
    }
  }

  //-------------------------------------------------------------------------

  private selectDistribution() : Distribution|undefined {
    if (this._par) {
      if (this.chartType.value == "daily") {
        return this._par.distributions?.daily
      }

      if (this.tradeType.value == "all") {
        if (this.profitType.value == "gross") {
          return this._par.distributions?.tradesAllGross
        }
        return this._par.distributions?.tradesAllNet
      }

      if (this.tradeType.value == "long") {
        if (this.profitType.value == "gross") {
          return this._par.distributions?.tradesLongGross
        }
        return this._par.distributions?.tradesLongNet
      }

      if (this.tradeType.value == "short") {
        if (this.profitType.value == "gross") {
          return this._par.distributions?.tradesShortGross
        }
        return this._par.distributions?.tradesShortNet
      }
    }

    return undefined
  }

  //-------------------------------------------------------------------------

  buildCategories () : string[] {
    let labels : string[] = []

    if (this.selDistrib != undefined) {
      this.selDistrib.histogram?.ranges.forEach(bar => {
        let label = this.formatPrice(Math.floor(bar.minValue)) +" : "+ this.formatPrice(Math.floor(bar.maxValue))
        labels.push(label)
      })
    }

    return labels
  }

  //-------------------------------------------------------------------------

  buildColors() : string[] {
    let colors : string[] = []

    if (this.selDistrib != undefined) {
      this.selDistrib.histogram?.ranges.forEach(bar => {
        let col = "#50ee3e"

        if (bar.maxValue <0) col = "#d4526e"
        else if (bar.minValue < 0) col = "#f48024"

        colors.push(col)
      })
    }

    return colors
  }

  //-------------------------------------------------------------------------

  private formatPrice = (value : number) : string => {
    if (value >= 0) {
      return this._par?.tradingSystem?.currencySymbol + String(value)
    }

    return "-"+ this._par?.tradingSystem?.currencySymbol + Math.abs(value)
  }
}

//=============================================================================
