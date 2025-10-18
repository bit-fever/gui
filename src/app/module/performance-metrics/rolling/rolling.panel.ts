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
  ApexAxisChartSeries,
  ChartComponent
} from "ng-apexcharts";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {ChartOptions} from "../../../lib/chart-lib";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {MinMax} from "../../../lib/min-max";
import {Lib} from "../../../lib/lib";
import {PerformanceAnalysisResponse, RollingInfo} from "../../../model/performance";

//=============================================================================

@Component({
  selector: 'performance-rolling-panel',
  templateUrl: './rolling.panel.html',
  styleUrls:  ['./rolling.panel.scss'],
  imports: [
    ChartComponent,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
  ]
})

//=============================================================================

export class PerformanceRollingPanel extends AbstractPanel {
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

  chartType   = new FormControl("returns")
  tradeType   = new FormControl("all")
  returnType  = new FormControl("net")
  viewType    = new FormControl("daily")

  dailyOptions    : ChartOptions
  dayYoYOptions   : ChartOptions
  monthlyOptions  : ChartOptions
  monthYoYOptions : ChartOptions

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private localService : LocalService) {
    super(eventBusService, labelService, router, "module.performance.rolling", "")

    this.dailyOptions    = this.buildDailyOptions()
    this.monthlyOptions  = this.buildMonthlyOptions()
    this.dayYoYOptions   = this.buildDayYoYOptions()
    this.monthYoYOptions = this.buildMonthYoYOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
//    this.chartType.setValue(this.localService.getItemWithDefault(Setting.Portfolio_TradSys_PerfDistrib, "daily"))
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onChartTypeChange() {
//    let value = this.chartType.value
//    this.localService.setItem(Setting.Portfolio_TradSys_PerfDistrib, value)
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onTradeTypeChange() {
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onReturnTypeChange() {
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------

  onViewTypeChange() {
    this.rebuildChart()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private rebuildChart() {
    this.rebuildDailyChart()
    this.rebuildMonthlyChart()
    this.rebuildDayYoYChart()
    this.rebuildMonthYoYChart()
  }

  //-------------------------------------------------------------------------

  private rebuildDailyChart() {
    let dailyData = this.getSerie(this._par?.rolling?.daily)
    this.dailyOptions.series = [{
      name : this.loc("daily"),
      data : dailyData
    }]

    let dailyMinMax  = new MinMax(dailyData)
    this.dailyOptions.plotOptions = Lib.chart.buildHeathmapPlotOptions(dailyMinMax)
  }

  //-------------------------------------------------------------------------

  private rebuildMonthlyChart() {
    let monthlyData = this.getSerie(this._par?.rolling?.monthly)
    this.monthlyOptions.series = [{
      name : this.loc("monthly"),
      data : monthlyData
    }]

    let monthlyMinMax  = new MinMax(monthlyData)
    this.monthlyOptions.plotOptions = Lib.chart.buildHeathmapPlotOptions(monthlyMinMax)
  }

  //-------------------------------------------------------------------------

  private rebuildDayYoYChart() {
    let series : ApexAxisChartSeries = []
    let minMax = new MinMax()

    this._par?.rolling?.dayYoY.forEach((yoy) => {
      let data = this.getSerie(yoy.data)
      minMax.add(data)

      series.push({
        name : yoy.year +"",
        data : data
      })
    })

    this.dayYoYOptions.series      = series
    this.dayYoYOptions.plotOptions = Lib.chart.buildHeathmapPlotOptions(minMax)
  }

  //-------------------------------------------------------------------------

  private rebuildMonthYoYChart() {
    let series : ApexAxisChartSeries = []
    let minMax = new MinMax()

    this._par?.rolling?.monthYoY.forEach((yoy) => {
      let data = this.getSerie(yoy.data)
      minMax.add(data)

      series.push({
        name : yoy.year +"",
        data : data
      })
    })

    this.monthYoYOptions.series      = series
    this.monthYoYOptions.plotOptions = Lib.chart.buildHeathmapPlotOptions(minMax)
  }

  //-------------------------------------------------------------------------

  private getSerie(list : RollingInfo[]|undefined) : number[] {
    let chartType = this.chartType.value
    let tradeType = this.tradeType.value
    let returnType= this.returnType.value

    let res : number[] = []

    if (chartType != null && tradeType != null && returnType != null) {
      list?.forEach(item => {
        let value = this.getSerieElem(item, chartType, tradeType, returnType)
        res = [ ...res, value ]
      })
    }

    return res
  }

  //-------------------------------------------------------------------------

  private getSerieElem(item : RollingInfo, chartType : string, tradeType : string, returnType : string) : number {
    //--- Returns

    if (chartType == "returns") {
      if (tradeType == "all") {
        if (returnType == "gross") {
          return item.grossReturns.total
        }
        else if (returnType == "net") {
          return item.netReturns.total
        }
      }
      else if (tradeType == "long") {
        if (returnType == "gross") {
          return item.grossReturns.long
        }
        else if (returnType == "net") {
          return item.netReturns.long
        }
      }
      else if (tradeType == "short") {
        if (returnType == "gross") {
          return item.grossReturns.short
        }
        else if (returnType == "net") {
          return item.netReturns.short
        }
      }
    }

    //--- Trades

    else if (chartType == "trades") {
      if (tradeType == "all") {
        return item.trades.total
      }
      else if (tradeType == "long") {
        return item.trades.long
      }
      else if (tradeType == "short") {
        return item.trades.short
      }
    }

    return 0
  }

  //-------------------------------------------------------------------------

  private buildDailyOptions () : any {
    return {
      chart: {
        type : "heatmap",
        height: 150,
        toolbar: {
          show: false
        },
      },

      series: [],

      dataLabels: {
        enabled  : true,
        formatter: this.priceFormatter
      },

      plotOptions: {},

      xaxis: {
        categories: this.buildDailyCategories()
      },

      legend: {
        show: false
      },
    }
  }

  //-------------------------------------------------------------------------

  private buildDailyCategories() : string[] {
    return [
      this.map("dows", "sun"),
      this.map("dows", "mon"),
      this.map("dows", "tue"),
      this.map("dows", "wed"),
      this.map("dows", "thu"),
      this.map("dows", "fri"),
      this.map("dows", "sat"),
    ]
  }

  //-------------------------------------------------------------------------

  private buildDayYoYOptions () : any {
    return {
      chart: {
        type : "heatmap",
        toolbar: {
          show: false
        },
      },

      series: [],

      dataLabels: {
        enabled  : true,
        formatter: this.priceFormatter
      },

      plotOptions: {},

      xaxis: {
        categories: this.buildDailyCategories()
      },

      legend: {
        show: false
      },
    }
  }

  //-------------------------------------------------------------------------

  private buildMonthlyOptions() : any {
    return {
      chart: {
        type: "heatmap",
        height: 100,
        animations: {
//        enabled: false
        },
        toolbar: {
          show: false
        },
        events: {
//        dataPointSelection: this.onChartClick,
        }
      },

      series: [],

      dataLabels: {
        enabled  : true,
        formatter: this.priceFormatter
      },

      plotOptions: {},

      xaxis: {
        categories: this.buildMonthlyCategories()
      },

      legend: {
        show: false
      },
    }
  }

  //-------------------------------------------------------------------------

  private buildMonthYoYOptions () : any {
    return {
      chart: {
        type : "heatmap",
//        height: 150,
        toolbar: {
          show: false
        },
      },

      series: [],

      dataLabels: {
        enabled  : true,
        formatter: this.priceFormatter
      },

      plotOptions: {},

      xaxis: {
        categories: this.buildMonthlyCategories()
      },

      legend: {
        show: false
      },
    }
  }

  //-------------------------------------------------------------------------

  private buildMonthlyCategories() : string[] {
    return [
      this.map("months", "jan"),
      this.map("months", "feb"),
      this.map("months", "mar"),
      this.map("months", "apr"),
      this.map("months", "may"),
      this.map("months", "jun"),
      this.map("months", "jul"),
      this.map("months", "aug"),
      this.map("months", "sep"),
      this.map("months", "oct"),
      this.map("months", "nov"),
      this.map("months", "dec"),
    ]
  }

  //-------------------------------------------------------------------------

  private priceFormatter = (value : number) : string => {
    if (this.chartType.value == "trades") {
      return String(value)
    }

    if (value >= 0) {
      return this._par?.tradingSystem?.currencySymbol + String(value)
    }

    return "-"+ this._par?.tradingSystem?.currencySymbol + Math.abs(value)
  }
}

//=============================================================================
