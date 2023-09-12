//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}            from "@angular/common";
import {MatCardModule}           from "@angular/material/card";
import {MatIconModule}           from "@angular/material/icon";
import {MatButtonModule}         from "@angular/material/button";
import {MatTreeModule}           from "@angular/material/tree";
import {Chart}                   from "chart.js/auto";
import {AbstractPanel}           from "../../../../../component/abstract.panel";
import {LabelService}            from "../../../../../service/label.service";
import {EventBusService}         from "../../../../../service/eventbus.service";
import {FlexTreePanel}           from "../../../../../component/panel/flex-tree/flex-tree.panel";
import {TreeNodeProvider}        from "../../../../../model/flex-tree";
import {PortfolioService}        from "../../../../../service/portfolio.service";
import {PortfolioTree, TradingSystem} from "../../../../../model/model";
import {MatListModule} from "@angular/material/list";
import {MatDividerModule} from "@angular/material/divider";

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
  imports     : [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatTreeModule,
                 MatListModule, MatDividerModule, FlexTreePanel],
  standalone  : true
})

//=============================================================================

export class MonitoringPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  roots : PortfolioTree[] = [];
  nodeProvider = new PorfolioNodeProvider();
  tradingSystems: TradingSystem[] = [];

  chart : any;

  @ViewChild("tsList") matList = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService  : EventBusService,
              labelService     : LabelService,
              private portfolioService : PortfolioService) {

    super(eventBusService, labelService, "portfolio.monitoring");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.createLineChart();
    this.portfolioService.getPortfolioTree().subscribe(
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
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private buildTSList(node : PortfolioTree) : TradingSystem[] {

    let res = [...node.tradingSystems];

    for (var child of node.children) {
      res = [...res, ...this.buildTSList(child)]
    }

    return res;
  }

  //-------------------------------------------------------------------------

  createBarChart(){

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
          '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ],
        datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
              '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
              '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }

    });
  }

  createLineChart(){

    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
          '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ],
        datasets: [
          {
            label: "Sales",
            data: ['467','576', '572', '79', '92',
              '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
              '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio:2.5
      }

    });
  }
}

//=============================================================================
