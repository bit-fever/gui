//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}            from "@angular/common";
import {MatIconModule}           from "@angular/material/icon";
import {MatButtonModule}         from "@angular/material/button";
import {AbstractPanel}           from "../../../../../component/abstract.panel";
import {LabelService}            from "../../../../../service/label.service";
import {EventBusService}         from "../../../../../service/eventbus.service";
import {FlexTreePanel}           from "../../../../../component/panel/flex-tree/flex-tree.panel";
import {TreeNodeProvider}        from "../../../../../model/flex-tree";
import {PortfolioService}        from "../../../../../service/portfolio.service";
import {
  PortfolioMonitoringResponse,
  PortfolioTree,
  TradingSystem
} from "../../../../../model/model";
import {MatDividerModule} from "@angular/material/divider";
import {FlexTablePanel} from "../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../model/flex-table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {AppEvent} from "../../../../../model/event";
import {MatSlideToggleChange, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {createChart} from "./chart-management";
import {ChartOptions, ChartType} from "./model";

//=============================================================================

class PorfolioNodeProvider implements TreeNodeProvider<PortfolioTree> {
  getChildren(node: PortfolioTree): PortfolioTree[] {
    if (node.children !== undefined) {
      return node.children;
    }

    return [];
  }

  getName(node: PortfolioTree): string {
    if (node.name !== undefined) {
      return node.name;
    }

    return "";
  }

}

//=============================================================================

@Component({
  selector    :     'portfolio-monitoring',
  templateUrl :   './monitoring.panel.html',
  styleUrls   : [ './monitoring.panel.scss' ],
  imports     : [CommonModule, MatButtonModule, MatIconModule, MatDividerModule, MatFormFieldModule,
                 MatSelectModule, MatSlideToggleModule, FlexTreePanel, FlexTablePanel],
  standalone  : true
})

//=============================================================================

export class MonitoringPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  nodeProvider = new PorfolioNodeProvider();
  roots         : PortfolioTree[] = [];
  tradingSystems: TradingSystem[] = [];
  columns       : FlexTableColumn[] = [];

  chart     : any;
  periods   : any;
  chartTypes: any;

  options = new ChartOptions();

  selectedPeriod   : number   = 30;
  selectedChartType: string   = ChartType.Equities;
  selectedIds      : number[] = [];
  serviceResponse  : PortfolioMonitoringResponse|null = null;

  // @ts-ignore
  @ViewChild("tsTable") flexTable : FlexTablePanel;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService  : EventBusService,
              labelService     : LabelService,
              private portfolioService : PortfolioService) {

    super(eventBusService, labelService, "portfolio.monitoring");
    super.subscribeToApp(AppEvent.LOCALIZATION_READY, (event : AppEvent) => this.setupAfterLanguageLoaded());
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupAfterLanguageLoaded();
    this.portfolioService.getPortfolioTree().subscribe(
      result => {
        this.roots = result;
      }
    )
  }

  //-------------------------------------------------------------------------

  private setupAfterLanguageLoaded = () => {
    this.setupColumns();
    this.periods    = this.labelMap("periods");
    this.chartTypes = this.labelMap("chartTypes");

    this.options.labelTotRawProfit   = this.loc("totalRawProfit")
    this.options.labelTotNetProfit   = this.loc("totalNetProfit")
    this.options.labelTotRawDrawdown = this.loc("totalRawDrawdown")
    this.options.labelTotNetDrawdown = this.loc("totalNetDrawdown")
    this.options.labelTotTrades      = this.loc("totalTrades")
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  onNodeSelected(node : PortfolioTree) {
    let list = this.buildTSList(node);
    this.tradingSystems = list.sort( (a,b) => {
      if (a.name != undefined && b.name != undefined) {
        return a.name < b.name ? -1: 1
      }

      return 0;
    });

    this.flexTable.clearSelection();
    this.destroyChart();
    this.selectedIds = [];
  }

  //-------------------------------------------------------------------------

  onRowSelected(selection : TradingSystem[]) {
    // @ts-ignore
    this.selectedIds = selection.map( ts => ts.id);
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onPeriodChange(e: MatSelectChange) {
    this.selectedPeriod = e.value;
    this.reload(true);
  }

  //-------------------------------------------------------------------------

  onChartTypeChange(e : MatSelectChange) {
    this.options.chartType = e.value;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onTotalsChange(e : MatSlideToggleChange) {
    this.options.showTotals = e.checked;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onRawProfitChange(e : MatSlideToggleChange) {
    this.options.showRawProfit = e.checked;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onNetProfitChange(e : MatSlideToggleChange) {
    this.options.showNetProfit = e.checked;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onRawDrawdownChange(e : MatSlideToggleChange) {
    this.options.showRawDrawdown = e.checked;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onNetDrawdownChange(e : MatSlideToggleChange) {
    this.options.showNetDrawdown = e.checked;
    this.reload(false);
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
      this.portfolioService.getPortfolioMonitoring(this.selectedIds, this.selectedPeriod).subscribe(
        result => {
          this.serviceResponse = result;
          this.chart = createChart(this.options, result);
        }
      )
    }
    else if (this.serviceResponse != null) {
      this.chart = createChart(this.options, this.serviceResponse);
    }
  }

  //-------------------------------------------------------------------------

  private setupColumns = () => {
    let ts = this.labelService.getLabel("model.tradingSystem");

    this.columns = [
      new FlexTableColumn(ts, "name"),
    ]
  }

  //-------------------------------------------------------------------------

  private buildTSList(node : PortfolioTree) : TradingSystem[] {

    let res = [...node.tradingSystems];

    for (var child of node.children) {
      res = [...res, ...this.buildTSList(child)]
    }

    return res;
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
