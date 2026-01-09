//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AbstractPanel} from "../../../component/abstract.panel";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {LocalService} from "../../../service/local.service";
import {QualityAnalysisResponse} from "../../../model/quality";
import {Details, Distribution, SimulationRequest, SimulationResult} from "../../../model/simulation";
import {FlatButton} from "../../../component/form/flat-button/flat-button";
import {ApexPlotOptions, ChartComponent} from "ng-apexcharts";
import {ChartOptions} from "../../../lib/chart-lib";
import {PorTradingSystem} from "../../../model/model";

//=============================================================================

@Component({
  selector: 'simulation-results',
  templateUrl: './results.panel.html',
  styleUrls:  ['./results.panel.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    FlatButton,
    ChartComponent,
  ]
})

//=============================================================================

export class SimulationResultsPanel extends AbstractPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //---------------------------------------------------------------------------

  @Input() ts? : PorTradingSystem

  @Input()
  set res(res : SimulationResult|undefined) {
    this._res = res
    this.rebuild()
  }

  get res() : SimulationResult|undefined {
    return this._res
  }

  _res? : SimulationResult

  @Output() rerunChange = new EventEmitter();

  //---------------------------------------------------------------------------

  tradeType   = new FormControl("all")
  returnType  = new FormControl("net")
  viewType    = new FormControl("equity")

  chartOptions : ChartOptions;
  maxDDPerc?   : number
  maxDDRMul?   : string

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(eventBusService      : EventBusService,
              labelService         : LabelService,
              router               : Router,
              private localService : LocalService) {
    super(eventBusService, labelService, router, "module.simulation.result")

    this.chartOptions  = this.buildChartOptions()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.rebuild()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  details() : Details|undefined {
    let tradeType  = this.tradeType.value
    let returnType = this.returnType.value

    //--- All

    if (tradeType == "all") {
      if (returnType == "gross") {
        return this.res?.grossAll
      }

      return this.res?.netAll
    }

    //--- Long

    if (tradeType == "long") {
      if (returnType == "gross") {
        return this.res?.grossLong
      }

      return this.res?.netLong
    }

    //--- Short

    if (returnType == "gross") {
      return this.res?.grossShort
    }

    return this.res?.netShort
  }

  //-------------------------------------------------------------------------

  viewEquity() : boolean {
    return this.viewType.value == "equity"
  }

  //-------------------------------------------------------------------------

  viewDrawdown() : boolean {
    return this.viewType.value == "drawdown"
  }

  //-------------------------------------------------------------------------

  maxxDDValue() : string {
    if (this.maxDDRMul == undefined || this.res?.risk == undefined) {
      return "";
    }

    let rValue = Number(this.maxDDRMul.substring(0, this.maxDDRMul.length - 1))
    return (rValue * this.res.risk) +" "+ this.ts?.currencyCode
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onTradeTypeChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------

  onReturnTypeChange() {
    this.rebuild()
  }

  //-------------------------------------------------------------------------

  onReRunClick() {
    this.rerunChange.emit()
  }

  //-------------------------------------------------------------------------

  onChartInit = () => {
    this.maxDDPerc = undefined
  }

  //-------------------------------------------------------------------------

  onChartClick = (e: any, chart?: any, options?: any) => {
    let index = options.dataPointIndex
    let distrib = this.details()?.maxDrawdowns
    let xSerie = distrib?.xAxis
    let ySerie = distrib?.yAxis

    console.log("Clicked max drawdown distribution. Index="+ index)

    this.maxDDPerc = undefined
    if (xSerie == undefined || ySerie == undefined || this.res?.runs == undefined) {
      return
    }

    let sum = 0
    for (let i=0; i<=index; i++) {
      sum += ySerie[i]
    }

    this.maxDDPerc = Math.round(sum * 100/ this.res.runs)
    this.maxDDRMul = xSerie[index]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildChartOptions() : ChartOptions {
    return {
      title: {
        text: this.loc("chartTitle")
      },
      chart: {
        type: "bar",
        height: "94%",
        events: {
          beforeMount: this.onChartInit,
          dataPointSelection: this.onChartClick,
        }
      },

      series: [],

      legend: {},

      plotOptions: {
        bar: {
          columnWidth: "95%",
        }
      },

      stroke: {},

      dataLabels: {
        enabled: false,
      },

      colors: [ "#008FFB" ],
      xaxis: {
        title: {
          text: this.loc("maxDDRMult")
        }
      },

      yaxis: {
        decimalsInFloat: 0,
        title: {
          text: this.loc("maxDDCount")
        }
      },
      annotations: {},
      labels: [],
      grid: {}
    }
  }

  //-------------------------------------------------------------------------

  private rebuild() {
    let details = this.details()
    this.rebuildChart(details)
  }

  //-------------------------------------------------------------------------

  private rebuildChart(details: Details|undefined) {
    if (details == undefined || details.maxDrawdowns == undefined) {
      this.chartOptions.series = []
      return
    }

    this.chartOptions.series = [{
      name: this.loc("maxDDCount"),
      data: details.maxDrawdowns.yAxis,
    }]

    this.chartOptions.xaxis = {
      type: "category",
      categories: details.maxDrawdowns.xAxis
    }
  }
}

//=============================================================================
