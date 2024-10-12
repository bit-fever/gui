//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {Component} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {NgIf} from "@angular/common";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {
  BacktestedConfig, BiasBacktestRequest,
  BiasBacktestResponse, BiasTrade, SickSession,
  SimpleTreeNodeProvider, TradingSession,
  TreeNode
} from "../../../../../../model/model";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {FlexTreePanel} from "../../../../../../component/panel/flex-tree/flex-tree.panel";
import {categories, MonthsTranscoder} from "../playground/bias-analysis.playground";
import {MatDivider} from "@angular/material/divider";
import {DateTimeTranscoder, OperationTranscoder} from "../../../../../../component/panel/flex-table/transcoders";
import {FlexTablePanel} from "../../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../../model/flex-table";
import {ApexAxisChartSeries, ChartComponent} from "ng-apexcharts";
import {MatButtonToggleChange, MatButtonToggleModule} from "@angular/material/button-toggle";
import {InventoryService} from "../../../../../../service/inventory.service";
import {InputNumberRequired} from "../../../../../../component/form/input-integer-required/input-number-required";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {CollectorService} from "../../../../../../service/collector.service";
import "./charts-config"
import {avgTradeChartOptions, equityChartOptions, numTradesChartOptions, profitChartOptions} from "./charts-config";

//=============================================================================

const General         = "general"
const BacktestConfigs = "backtest"
const BacktestConfig  = "config"
const ListOfTrades    = "trades"
const ProfitDistrib   = "distrib"
const Equity          = "equity"

//=============================================================================

@Component({
  selector    :   'bias-analysis-backtest',
  templateUrl :   'bias-analysis.backtest.html',
  styleUrls   : [ 'bias-analysis.backtest.scss' ],
  imports: [MatButtonModule, NgIf, MatGridListModule, MatIconModule, FlexTreePanel,
    MatDivider, FlexTablePanel, ChartComponent, MatButtonToggleModule, InputNumberRequired, SelectTextRequired],
  standalone  : true,
})

//=============================================================================

export class BiasAnalysisBacktestPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  baId : number = 0
  backtestReq = new BiasBacktestRequest()

  sessionId : number = 1

  sessions : TradingSession[] = []

  //-------------------------------------------------------------------------

  nodeProvider = new SimpleTreeNodeProvider();

  roots    : TreeNode[]       = [];
  response?: BiasBacktestResponse
  nodeType : string = ""
  nodeData : any

  tradeColumns : FlexTableColumn[] = []
  tradeList    : BiasTrade[]       = []

  //--- Chart distribution stuff

  chartType  : string = "profits"
  threshold  : number[] = []

  distribNetProfits : number[] = []
  distribNumTrades  : number[] = []
  distribAvgTrades  : number[] = []

  equiGrossProfit : number[] = []
  equiNetProfit   : number[] = []

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService         : EventBusService,
              labelService            : LabelService,
              router                  : Router,
              private route           : ActivatedRoute,
              private collectorService: CollectorService,
              private inventoryService: InventoryService) {

    super(eventBusService, labelService, router, "tool.biasBacktest");
    this.setupTradeColumns()

    inventoryService.getTradingSessions().subscribe(
      result => {
        this.sessions = result.result;
      })
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.baId = Number(this.route.snapshot.paramMap.get("id"));
    this.setupTradeColumns()
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
      this.setupProfitCharts()
    }
    else if (this.nodeData == Equity) {
      this.buildEquity()
      this.setupEquityChart()
    }
  }

  //-------------------------------------------------------------------------

  onRun() {
    let sessionSpec = this.getSessionDef()
    if (sessionSpec == undefined) {
      alert("Session is undefined!")
      return
    }

    this.backtestReq.session = sessionSpec

    this.collectorService.runBacktest(this.baId, this.backtestReq).subscribe( res => {
      this.response  = res
      this.roots     = this.createTree(res)
      this.threshold = this.buildThreshold()
    })
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
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getSessionDef() : string|undefined {
    let res : SickSession|undefined = undefined

    this.sessions.forEach( ts => {
      if (ts.id == this.sessionId) {
        res = ts.session
      }
    })

    return res
  }

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

    node.add(new TreeNode(Equity,        this.loc("equity"),           btc))
    node.add(new TreeNode(ListOfTrades,  this.loc("listOfTrades"),     btc))
    node.add(new TreeNode("",            this.loc("annualSummary"),    btc))
    node.add(new TreeNode(ProfitDistrib, this.loc("profitDistrib"),    btc))
    node.add(new TreeNode("",            this.loc("triggerSequences"), btc))

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
  //---
  //--- Chart methods
  //---
  //-------------------------------------------------------------------------

  private buildEquity() {
    let grossEquity : any[] = []
    let netEquity   : any[] = []
    let index = 0

    this.nodeData.biasTrades.forEach( (bt : BiasTrade) => {
      let date = new Date(bt.exitTime)

      if (index == 0) {
        grossEquity = [ [date, bt.grossProfit] ]
        netEquity   = [ [date, bt.netProfit  ] ]
      }
      else {
        grossEquity.push([date, grossEquity[index -1] + bt.grossProfit])
        netEquity  .push([date, netEquity  [index -1] + bt.netProfit  ])
      }

      index++
    })

    this.equiGrossProfit = grossEquity
    this.equiNetProfit   = netEquity
  }

  //-------------------------------------------------------------------------

  private buildProfitDistribution() {
    let profits   : number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    let numTrades : number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    let avgTrades : number[] = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]

    this.nodeData.biasTrades.forEach( (bt : BiasTrade) => {
      if (bt.netProfit) {
        let found = false

        for (let i=0; i<15; i++) {
          if (bt.netProfit < this.threshold[i]) {
            profits[i] += bt.netProfit
            numTrades[i] += 1
            found = true
            break
          }
        }

        if ( !found) {
          profits  [15] += bt.netProfit
          numTrades[15] += 1
        }
      }
    })

    for (let i=0; i<16; i++) {
      if (numTrades[i] != 0) {
        avgTrades[i] = Math.round((profits[i] / numTrades[i]) * 100) / 100
      }

      profits[i] = Math.round(profits[i])
    }

    this.distribNetProfits = profits
    this.distribNumTrades  = numTrades
    this.distribAvgTrades  = avgTrades
  }

  //-------------------------------------------------------------------------

  private setupProfitCharts() {
    this.profitChartOptions.series = <ApexAxisChartSeries>[
      {
        name: this.loc("netProfits"),
        data: this.distribNetProfits
      }]

    this.numTradesChartOptions.series = <ApexAxisChartSeries>[
      {
        name: this.loc("numTrades"),
        data: this.distribNumTrades
      }]

    this.avgTradeChartOptions.series = <ApexAxisChartSeries>[
      {
        name: this.loc("avgTrade"),
        data: this.distribAvgTrades
      }]
  }

  //-------------------------------------------------------------------------

  private setupEquityChart() {
    this.equityChartOptions.series = <ApexAxisChartSeries>[
      {
        name: this.loc("grossProfit"),
        data: this.equiGrossProfit
      },
      {
        name: this.loc("netProfit"),
          data: this.equiNetProfit
      }]
  }

  //-------------------------------------------------------------------------

  private buildThreshold() : number[] {
    let threshold : number[] = []
    let costPerTrade = this.response?.brokerProduct?.costPerTrade
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

  protected readonly profitChartOptions = profitChartOptions;
  protected readonly numTradesChartOptions = numTradesChartOptions;
  protected readonly avgTradeChartOptions = avgTradeChartOptions;
  protected readonly equityChartOptions = equityChartOptions;
}

//=============================================================================
