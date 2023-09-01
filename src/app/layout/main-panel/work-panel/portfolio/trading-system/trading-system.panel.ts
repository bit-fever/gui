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
import {TradingSystem, TradingSystemFull} from "../../../../../model/model";
import {FlexTableColumn, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {TradingSystemService} from "../../../../../service/trading-system.service";
import {AppEvent} from "../../../../../model/event";
import {IntDateTranscoder, SuggestedActionTranscoder} from "../../../../../component/panel/flex-table/transcoders";

//=============================================================================

@Component({
	selector    :     'portfolio-trading-system',
	templateUrl :   './trading-system.panel.html',
	styleUrls   : [ './trading-system.panel.scss' ],
	imports     : [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule, FlexTablePanel],
	standalone  : true
})

//=============================================================================

export class TradingSystemPanel extends AbstractPanel {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	columns: FlexTableColumn[] = [];
	service: ListService<TradingSystemFull>;
  disView: boolean = true;

  @ViewChild("table") table : FlexTablePanel<TradingSystemFull>|null = null;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService     : EventBusService,
	            labelService        : LabelService,
      			tradingSystemService: TradingSystemService) {

		super(eventBusService, labelService, "portfolio.trading-system");
		this.service = tradingSystemService.getTradingSystems
		super.subscribeToApp(AppEvent.LOCALIZATION_READY, (event : AppEvent) => this.setup());
	}

	//-------------------------------------------------------------------------
	//---
	//--- Public methods
	//---
	//-------------------------------------------------------------------------

	override init = () : void => {}

	//-------------------------------------------------------------------------

	onRowSelected(selection : TradingSystemFull[]) {
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
	//---
	//--- Init methods
	//---
	//-------------------------------------------------------------------------

	setup = () => {
		this.setupColumns();
	}

	//-------------------------------------------------------------------------

	setupColumns = () => {
		let ts = this.labelService.getLabel("model.trading-system");

		this.columns = [
			new FlexTableColumn(ts, "name"),
			new FlexTableColumn(ts, "instrumentTicker"),
			new FlexTableColumn(ts, "lastPl"),
			new FlexTableColumn(ts, "tradingDays"),
			new FlexTableColumn(ts, "numTrades"),
			new FlexTableColumn(ts, "suggestedAction", undefined, new SuggestedActionTranscoder()),
			new FlexTableColumn(ts, "lastUpdate", new IntDateTranscoder()),
		]
	}

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : TradingSystemFull[]) => {
    this.disView = (selection.length != 1)
  }
}

//=============================================================================
