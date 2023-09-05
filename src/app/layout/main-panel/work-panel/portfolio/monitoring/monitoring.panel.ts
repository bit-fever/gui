//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}               from '@angular/core';
import {CommonModule}            from "@angular/common";
import {MatCardModule}           from "@angular/material/card";
import {MatIconModule}           from "@angular/material/icon";
import {MatButtonModule}         from "@angular/material/button";
import {MatTreeModule}           from "@angular/material/tree";

import {AbstractPanel}           from "../../../../../component/abstract.panel";
import {LabelService}            from "../../../../../service/label.service";
import {EventBusService}         from "../../../../../service/eventbus.service";
import {FlexTreePanel}           from "../../../../../component/panel/flex-tree/flex-tree.panel";
import {TreeNodeProvider}        from "../../../../../model/flex-tree";
import {PortfolioService}        from "../../../../../service/portfolio.service";
import {PortfolioTree}           from "../../../../../model/model";

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
  imports     : [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatTreeModule, FlexTreePanel],
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


  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

}

//=============================================================================
