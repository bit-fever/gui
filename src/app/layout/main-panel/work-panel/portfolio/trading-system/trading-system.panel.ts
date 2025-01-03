//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
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

//=============================================================================

@Component({
	selector    :     'portfolio-trading-system',
	templateUrl :   './trading-system.panel.html',
	styleUrls   : [ './trading-system.panel.scss' ],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
    RouterModule, FlexTablePanel, MatButtonToggleGroup, MatButtonToggle, MatChipSet, MatChip, MatTooltip, MatChipListbox, MatChipOption, ReactiveFormsModule],
	standalone  : true
})

//=============================================================================

export class PorTradingSystemPanel extends AbstractPanel {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	columns  : FlexTableColumn[] = [];
	service  : ListService<PorTradingSystem>;
  disView  : boolean = true;
  disFilter: boolean = true;
  disAction: boolean = true;

  selRunning   = new FormControl("*")
  selActive    = new FormControl("*")
  selActivation= new FormControl("*")

  @ViewChild("table") table : FlexTablePanel<PorTradingSystem>|null = null;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService : EventBusService,
	            labelService    : LabelService,
              router          : Router,
              private snackBar        : MatSnackBar,
      			  private portfolioService: PortfolioService) {

		super(eventBusService, labelService, router, "portfolio.tradingSystem");
		this.service = portfolioService.getTradingSystems;
	}

	//-------------------------------------------------------------------------
	//---
	//--- Public methods
	//---
	//-------------------------------------------------------------------------

	override init = () : void => {
    this.setupColumns();
  }

	//-------------------------------------------------------------------------

	onRowSelected(selection : PorTradingSystem[]) {
    this.updateButtons(selection);
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

  onFilterClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.navigateTo([ Url.Portfolio_TradingSystems, selection[0].id, Url.Sub_Filtering ]);
    }
  }

  //-------------------------------------------------------------------------

  onStartClick() {
    this.setProperty(TradingSystemProperty.RUNNING, "true")
  }

  //-------------------------------------------------------------------------

  onStopClick() {
    this.setProperty(TradingSystemProperty.RUNNING, "false")
  }

  //-------------------------------------------------------------------------

  onActivateClick() {
    this.setProperty(TradingSystemProperty.ACTIVE, "true")
  }

  //-------------------------------------------------------------------------

  onDeactivateClick() {
    this.setProperty(TradingSystemProperty.ACTIVE, "false")
  }

  //-------------------------------------------------------------------------

  onManualClick() {
    this.setProperty(TradingSystemProperty.ACTIVATION, TsActivation.Manual +"")
  }

  //-------------------------------------------------------------------------

  onAutoClick() {
    this.setProperty(TradingSystemProperty.ACTIVATION, TsActivation.Auto +"")
  }

  //-------------------------------------------------------------------------
  //--- Table filtering
  //-------------------------------------------------------------------------

  onFlagRunningChange() {
    this.table?.applyFilter()
  }

  //-------------------------------------------------------------------------

  onFlagActiveChange() {
    this.table?.applyFilter()
  }

  //-------------------------------------------------------------------------

  onFlagActivationChange() {
    this.table?.applyFilter()
  }

  //-------------------------------------------------------------------------

  tableFilter = (row : PorTradingSystem, filter : string) : boolean => {
    return  this.filterText(row, filter)    &&
            this.filterRunning(row.running) &&
            this.filterActive(row.active)   &&
            this.filterActivation(row.activation)
  }

	//-------------------------------------------------------------------------
	//---
	//--- Init methods
	//---
	//-------------------------------------------------------------------------

	setupColumns = () => {
		let ts = this.labelService.getLabel("model.tradingSystem");

		this.columns = [
			new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "running",         undefined, new TradingSystemRunningStyler()),
      new FlexTableColumn(ts, "activation",      undefined, new TradingSystemActivationStyler()),
      new FlexTableColumn(ts, "active",          undefined, new TradingSystemActiveStyler()),
			new FlexTableColumn(ts, "status",          undefined, new TradingSystemStatusStyler()),
      new FlexTableColumn(ts, "suggestedAction", new MapTranscoder(this.labelService, "suggestedAction")),
			new FlexTableColumn(ts, "lmNetProfit"),
			new FlexTableColumn(ts, "lmNetAvgTrade"),
			new FlexTableColumn(ts, "lmNumTrades"),
			new FlexTableColumn(ts, "lastTrade",       new IsoDateTranscoder()),
		]
	}

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : PorTradingSystem[]) => {
    this.disView  = (selection.length != 1)
    this.disFilter= this.disView
    this.disAction= (selection.length != 1)
  }

  //-------------------------------------------------------------------------

  private setProperty(name:string, value:string) {
    // @ts-ignore
    let selection = this.table.getSelection();
    let id = selection[0].id
    // @ts-ignore
    this.portfolioService.setTradingSystemProperty(id, name, value).subscribe( res => {
      this.table?.reload()

      if (res.status == TspResponseStatus.OK) {
        let message = this.loc("message."+ name +"Ok")
        this.snackBar.open(message, undefined, { duration:2000 })
      }
      else if (res.status == TspResponseStatus.ERROR) {
        let message = this.loc("message."+ name +"Error")+" : "+ res.message
        this.snackBar.open(message, this.button("ok"))
      }
    })
  }

  //-------------------------------------------------------------------------
  //--- Table filtering
  //-------------------------------------------------------------------------

  private filterText(row : PorTradingSystem, filter : string) : boolean {
    let name = row.name?.trim().toLowerCase()
    if (name?.length == 0) {
      return true
    }

    return name?.indexOf(filter) != -1
  }

  //-------------------------------------------------------------------------

  private filterRunning(running? : boolean) : boolean {
    let value = this.selRunning.value

    if (running != undefined) {
      if (value == "*") {
        return true
      }
      return (value == "r" && running) || (value == "s" && !running)
    }

    return false
  }

  //-------------------------------------------------------------------------

  private filterActive(active? : boolean) : boolean {
    let value = this.selActive.value

    if (active != undefined) {
      if (value == "*") {
        return true
      }
      return (value == "a" && active) || (value == "i" && !active)
    }

    return false
  }

  //-------------------------------------------------------------------------

  private filterActivation(activation? : TsActivation) : boolean {
    let value = this.selActivation.value

    if (activation != undefined) {
      if (value == "*") {
        return true
      }
      return (value == "m" && activation == TsActivation.Manual) || (value == "a" && activation == TsActivation.Auto)
    }

    return false
  }
}

//=============================================================================
