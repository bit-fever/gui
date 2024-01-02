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
  InvTradingSystemFull
} from "../../../../../model/model";
import {MatDividerModule} from "@angular/material/divider";
import {FlexTablePanel} from "../../../../../component/panel/flex-table/flex-table.panel";
import {FlexTableColumn} from "../../../../../model/flex-table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {MatSlideToggleChange, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {createChart} from "./chart-management";
import {ChartOptions, ChartType} from "./model";
import {Router, RouterModule} from "@angular/router";
import {MatChipEvent, MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";
import {InventoryService} from "../../../../../service/inventory.service";

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
                 MatSelectModule, MatSlideToggleModule, RouterModule, MatChipsModule,
                 FlexTreePanel, FlexTablePanel],
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
  tradingSystems: InvTradingSystemFull[] = [];
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

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              private inventoryService : InventoryService,
              private portfolioService : PortfolioService) {

    super(eventBusService, labelService, router, "portfolio.monitoring");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
    this.periods    = this.labelMap("periods");
    this.chartTypes = this.labelMap("chartTypes");

    this.options.labelTotRawProfit   = this.loc("totalRawProfit")
    this.options.labelTotNetProfit   = this.loc("totalNetProfit")
    this.options.labelTotRawDrawdown = this.loc("totalRawDrawdown")
    this.options.labelTotNetDrawdown = this.loc("totalNetDrawdown")
    this.options.labelTotTrades      = this.loc("totalTrades")

    this.inventoryService.getPortfolioTree().subscribe(
      result => {
        this.roots = result;
      }
    )
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

  onRowSelected(selection : InvTradingSystemFull[]) {
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

  onTotalsChange(e: MatChipSelectionChange) {
    this.options.showTotals = e.selected;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onRawProfitChange(e : MatChipSelectionChange) {
    this.options.showRawProfit = e.selected;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onNetProfitChange(e : MatChipSelectionChange) {
    this.options.showNetProfit = e.selected;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onRawDrawdownChange(e : MatChipSelectionChange) {
    this.options.showRawDrawdown = e.selected;
    this.reload(false);
  }

  //-------------------------------------------------------------------------

  onNetDrawdownChange(e : MatChipSelectionChange) {
    this.options.showNetDrawdown = e.selected;
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

  private buildTSList(node : PortfolioTree) : InvTradingSystemFull[] {

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
