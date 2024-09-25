//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {DialogData} from "./dialog-data";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {
  BacktestedConfig,
  BiasBacktestResponse, BiasConfig, BiasTrade,
  SimpleTreeNodeProvider,
  TreeNode
} from "../../../../../../../model/model";
import {AbstractPanel} from "../../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../../service/label.service";
import {FlexTreePanel} from "../../../../../../../component/panel/flex-tree/flex-tree.panel";
import {categories, MinMax, MonthsTranscoder} from "../bias-analysis.playground";
import {MatDivider} from "@angular/material/divider";
import {DateTimeTranscoder, OperationTranscoder} from "../../../../../../../component/panel/flex-table/transcoders";
import {FlexTablePanel} from "../../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../../../model/flex-table";
import {ApexAxisChartSeries, ApexChart, ApexXAxis, ChartComponent} from "ng-apexcharts";
import {MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule} from "@angular/material/button-toggle";

//=============================================================================

const General         = "general"
const BacktestConfigs = "backtest"
const BacktestConfig  = "config"
const ListOfTrades    = "trades"
const ProfitDistrib   = "distrib"

//=============================================================================

@Component({
  selector    : 'bias-backtest-dialog',
  templateUrl : 'bias-backtest.dialog.html',
  styleUrls   : [ 'bias-backtest.dialog.scss' ],
  imports: [MatDialogModule, MatButtonModule, NgIf, MatGridListModule, MatIconModule, FlexTreePanel,
            MatDivider, FlexTablePanel, ChartComponent, MatButtonToggleModule],
  standalone  : true,
})

//=============================================================================

export class BiasBacktestDialog extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  nodeProvider = new SimpleTreeNodeProvider();

  roots    : TreeNode[] = [];
  response : BiasBacktestResponse
  nodeType : string = ""
  nodeData : any

  tradeColumns : FlexTableColumn[] = []
  tradeList    : BiasTrade[]       = []

  //--- Chart distribution stuff

  chartType  : string = "profits"
  threshold  : number[] = []
  dataProfit : number[] = []
  dataCount  : number[] = []

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private dialogRef       : MatDialogRef<BiasBacktestDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "tool.biasAnalysis.backtestDialog");
    this.response = data.response
    this.roots    = this.createTree(this.response)

    this.setupTradeColumns()
    this.threshold = this.buildThreshold()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  private createTree(res : BiasBacktestResponse) : TreeNode[] {
    let roots = [
      new TreeNode(General,         this.loc("general")),
      new TreeNode(BacktestConfigs, this.loc("backtestConfigs")),
    ]

    let configs = roots[1]

    res.backtestedConfigs.forEach( btc =>{
      configs.add(this.createConfig(btc))
    })

    return roots
  }

  //-------------------------------------------------------------------------

  private createConfig(btc : BacktestedConfig) : TreeNode {
    let bc   = btc.biasConfig
    let name = this.getLabelForSlot(bc?.startDay, bc?.startSlot) +" --> "+ this.getLabelForSlot(bc?.endDay, bc?.endSlot)
    let node = new TreeNode(BacktestConfig, name, btc)

    node.add(new TreeNode(ListOfTrades, this.loc("listOfTrades"),     btc))
    node.add(new TreeNode("", this.loc("annualSummary"),    btc))
    node.add(new TreeNode(ProfitDistrib, this.loc("profitDistrib"),    btc))
    node.add(new TreeNode("", this.loc("triggerSequences"), btc))

    return node
  }

  //-------------------------------------------------------------------------

  private getLabelForSlot(day? : number, slot? : number) : string {
    if (day != undefined && slot != undefined) {
      return this.labelService.getLabel("list.dowShort")[day] +" "+ categories[slot]
    }

    return "???"
  }

  //-------------------------------------------------------------------------

  private setupTradeColumns() {
    let ts = this.labelService.getLabel("model.biasTrade");

    this.tradeColumns = [
      new FlexTableColumn(ts, "entryTime", new DateTimeTranscoder()),
      new FlexTableColumn(ts, "entryValue"),
      new FlexTableColumn(ts, "exitTime", new DateTimeTranscoder()),
      new FlexTableColumn(ts, "exitValue"),
      new FlexTableColumn(ts, "grossProfit"),
      new FlexTableColumn(ts, "netProfit"),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events methods
  //---
  //-------------------------------------------------------------------------

  onNodeSelected(node : TreeNode) {
    this.nodeType = node.id
    this.nodeData = node.data

    if (this.nodeType == ProfitDistrib) {
      this.buildProfitDistribution()
      this.setupChartType()
    }
  }

  //-------------------------------------------------------------------------

  onChartTypeChange = (event: MatButtonToggleChange) => {
    this.chartType = event.value
    this.setupChartType()
  }

  //-------------------------------------------------------------------------
  //---
  //--- General methods
  //---
  //-------------------------------------------------------------------------

  startString() : string {
    let btc : BacktestedConfig = this.nodeData
    let bc = btc.biasConfig

    return this.getLabelForSlot(bc?.startDay, bc?.startSlot)
  }

  //-------------------------------------------------------------------------

  endString() : string {
    let btc : BacktestedConfig = this.nodeData
    let bc = btc.biasConfig

    return this.getLabelForSlot(bc?.endDay, bc?.endSlot)
  }

  //-------------------------------------------------------------------------

  biasMonths() : string {
    let btc : BacktestedConfig = this.nodeData
    let bc = btc.biasConfig

    // @ts-ignore
    return new MonthsTranscoder(this.labelService).transcode(bc.months, "")
  }

  //-------------------------------------------------------------------------

  operation() : string {
    let btc : BacktestedConfig = this.nodeData
    let bc = btc.biasConfig

    // @ts-ignore
    return new OperationTranscoder(this.labelService).transcode(bc.operation, "")
  }

  //-------------------------------------------------------------------------

  trunc2(value : number) : number {
    return Math.trunc(value * 100) / 100
  }

  //-------------------------------------------------------------------------
  //---
  //--- Chart config
  //---
  //-------------------------------------------------------------------------

  private buildProfitDistribution() {
    let dataProfit : number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    let dataCount  : number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

    this.nodeData.biasTrades.forEach( (bt : BiasTrade) => {
      if (bt.netProfit) {
        let found = false
        for (let i=0; i<15; i++) {
          if (bt.netProfit < this.threshold[i]) {
            dataProfit[i] += bt.netProfit
            dataCount [i] += 1
            found = true
            break
          }
        }

        if ( !found) {
          dataProfit[15] += bt.netProfit
          dataCount [15] += 1
        }
      }
    })

    this.dataProfit = dataProfit
    this.dataCount  = dataCount
  }

  //-------------------------------------------------------------------------

  private setupChartType() {
    if (this.chartType == "profits") {
      this.barOptions.series = <ApexAxisChartSeries>[
        {
          name: this.loc("profits"),
          data: this.dataProfit
        }]
    }

    else if (this.chartType == "trades") {
      this.barOptions.series = <ApexAxisChartSeries>[
        {
          name: this.loc("tradeCount"),
          data: this.dataCount
        }]
    }

    else {
      alert("Unknown chart type : "+this.chartType)
    }
  }

  //-------------------------------------------------------------------------

  private buildThreshold() : number[] {
    let threshold : number[] = []
    let costPerTrade = this.response.brokerProduct?.costPerTrade
    if (costPerTrade == undefined) {
      costPerTrade = 0
    }

    for (let i=6; i>=0; i--) {
      threshold = [ ...threshold, -Math.pow(2,i)*costPerTrade]
    }

    threshold = [ ...threshold, 0 ]

    for (let i=0; i<=6; i++) {
      threshold = [ ...threshold, Math.pow(2,i)*costPerTrade]
    }

    return threshold
  }

  //-------------------------------------------------------------------------

  barOptions = {
    chart: <ApexChart>{
      type: "bar",
      height: 500,
      toolbar: {
        show: false
      },
    },
    series: <ApexAxisChartSeries>[],

    plotOptions: {
      bar: {
        colors: {
          ranges:[
            {
              from: -3000000,
              to: 0,
              color: '#E04040'
            },
            {
              from: 0,
              to: 3000000,
              color: '#40E040'
            }
          ]
        }
      }
    },

    dataLabels: {
      enabled: true,
      style: {
        colors: ['#e0e0e0']
      },
      background: {
        enabled: true,
        foreColor: '#000000'
      }
    },

    xaxis: <ApexXAxis>{
      categories: [ "<64x", "-64x-32x", "-32x-16x", "-16x-8x", "-8x-4x", "-4x-2x",  "-2x-1x",  "-1x-0",
                    "0-1x", "1x-2x",    "2x-4x",    "4x-8x",   "8x-16x", "16x-32x", "32x-64x", ">64x"]
    }
  }
}

//=============================================================================
