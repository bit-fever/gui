//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {PorTradingSystem, TradingSystemProperty, TsActivation, TspResponseStatus} from "../../../../../model/model";
import {FlexTableColumn, ListService} from "../../../../../model/flex-table";
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {FlexTablePanel} from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService} from "../../../../../service/label.service";
import {EventBusService} from "../../../../../service/eventbus.service";
import {
  IsoDateTranscoder,
  MapTranscoder,
  TradingSystemActivationStyler,
  TradingSystemActiveStyler,
  TradingSystemRunningStyler,
  TradingSystemStatusStyler
} from "../../../../../component/panel/flex-table/transcoders";
import {Router, RouterModule} from "@angular/router";
import {Url} from "../../../../../model/urls";
import {PortfolioService} from "../../../../../service/portfolio.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatChip, MatChipListbox, MatChipOption, MatChipSet} from "@angular/material/chips";
import {MatTooltip} from "@angular/material/tooltip";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {StorageService} from "../../../../../service/storage.service";
import {Setting} from "../../../../../model/setting";
import {MatTabsModule} from "@angular/material/tabs";

//=============================================================================

@Component({
  selector    :     'portfolio-trading-system-db',
  templateUrl :   './trading-system.dashboard.html',
  styleUrls   : [ './trading-system.dashboard.scss' ],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
    RouterModule, MatButtonToggleGroup, MatButtonToggle, MatChipSet, MatChip, MatTooltip, MatChipListbox, MatChipOption,
    MatTabsModule, ReactiveFormsModule, NgOptimizedImage],
  standalone  : true
})

//=============================================================================

export class TradingSystemDashboard extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  tradingSystems : PorTradingSystem[] = [];

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router,
              private snackBar        : MatSnackBar,
              private portfolioService: PortfolioService,
              private storageService  : StorageService) {

    super(eventBusService, labelService, router, "portfolio.tradingSystem");
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  override init = () : void => {
    this.portfolioService.getTradingSystems().subscribe( res => {
      this.tradingSystems = res.result
    });
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      console.log(JSON.stringify(selection))
    }
  }

  //-------------------------------------------------------------------------

  public scope(code : string) : string {
    return this.map("scope", code)
  }

  //-------------------------------------------------------------------------
  //--- Table filtering
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------


  //-------------------------------------------------------------------------
  //--- Table filtering
  //-------------------------------------------------------------------------

}

//=============================================================================
