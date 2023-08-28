//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}            from '@angular/core';
import {CommonModule}         from "@angular/common";
import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {TradingSystem}        from "../../../../../model/model";
import {ListService}          from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {TradingSystemService} from "../../../../../service/trading-system.service";

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

	columns: string[] = ['name', 'instrumentId', 'lastPl', 'numTrades', 'tradingDays', 'suggestedAction', 'lastUpdate'];
	service: ListService<TradingSystem>;

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
	}

	//-------------------------------------------------------------------------
	//---
	//--- Public methods
	//---
	//-------------------------------------------------------------------------

	override init = () : void => {}

	//-------------------------------------------------------------------------

	onRowSelected(selection : TradingSystem[]) {
		console.log(JSON.stringify(selection))
	}
}

//=============================================================================
