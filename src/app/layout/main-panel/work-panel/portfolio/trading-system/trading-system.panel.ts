//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {PorTradingSystem}     from "../../../../../model/model";
import {FlexTableColumn, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {IntDateTranscoder, LabelTranscoder} from "../../../../../component/panel/flex-table/transcoders";
import {Router, RouterModule} from "@angular/router";
import {Url} from "../../../../../model/urls";
import {PortfolioService} from "../../../../../service/portfolio.service";

//=============================================================================

@Component({
	selector    :     'portfolio-trading-system',
	templateUrl :   './trading-system.panel.html',
	styleUrls   : [ './trading-system.panel.scss' ],
	imports     : [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
                 RouterModule, FlexTablePanel],
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

  @ViewChild("table") table : FlexTablePanel<PorTradingSystem>|null = null;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService : EventBusService,
	            labelService    : LabelService,
              router          : Router,
      			  portfolioService: PortfolioService) {

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
	//---
	//--- Init methods
	//---
	//-------------------------------------------------------------------------

	setupColumns = () => {
		let ts = this.labelService.getLabel("model.tradingSystem");

		this.columns = [
			new FlexTableColumn(ts, "name"),
			new FlexTableColumn(ts, "status", new LabelTranscoder(this.labelService, "page.portfolio.tradingSystem.status")),
			new FlexTableColumn(ts, "closedProfit"),
			new FlexTableColumn(ts, "tradingDays"),
			new FlexTableColumn(ts, "numTrades"),
			new FlexTableColumn(ts, "lastUpdate", new IntDateTranscoder()),
		]
	}

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : PorTradingSystem[]) => {
    this.disView = (selection.length != 1)
    this.disFilter= this.disView
  }
}

//=============================================================================
