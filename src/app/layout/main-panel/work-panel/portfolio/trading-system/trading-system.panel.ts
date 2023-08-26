//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {AfterViewInit, Component, ViewChild} from '@angular/core';

import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {TradingSystem}        from "../../../../../model/model";
import {TradingSystemService} from "../../../../../service/trading-system.service";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {CommonModule} from "@angular/common";

//=============================================================================

@Component({
	selector    :     'portfolio-trading-system',
	templateUrl :   './trading-system.panel.html',
	styleUrls   : [ './trading-system.panel.scss' ],
	imports     : [ CommonModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatCardModule, MatIconModule ],
	standalone  : true
})

//=============================================================================

export class TradingSystemPanel extends AbstractPanel implements AfterViewInit {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	tableColumns: string[] = ['name', 'instrumentId', 'lastPl', 'numTrades', 'tradingDays', 'suggestedAction', 'lastUpdate'];
	tableData = new MatTableDataSource<TradingSystem>();
	selRow: any;

	@ViewChild(MatPaginator) paginator: MatPaginator|null = null;
	@ViewChild(MatSort)      sort     : MatSort     |null = null;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(        eventBusService     : EventBusService,
	            private labelService        : LabelService,
				private tradingSystemService: TradingSystemService) {

		super(eventBusService);
	}

	//-------------------------------------------------------------------------
	//---
	//--- Public methods
	//---
	//-------------------------------------------------------------------------

	override init = () : void => {}

	//-------------------------------------------------------------------------

	ngAfterViewInit() {
		this.tableData.paginator = this.paginator;
		this.tableData.sort      = this.sort;
		this.reload();
	}

	//-------------------------------------------------------------------------

	reload = () : void => {
		this.tradingSystemService.getTradingSystems().subscribe(
			result => {
				this.tableData.data = result.result;
			})
	}

	//-------------------------------------------------------------------------

	loc(code : string) : string {
		return this.labelService.getLabel("portfolio.trading-system", code);
	}

	//-------------------------------------------------------------------------

	onRowClick(row : any) : void {
		//console.log(JSON.stringify(row));
		this.selRow = row;
	}

	//-------------------------------------------------------------------------

	isRowClicked(row : any) : boolean {
		return row == this.selRow;
	}
}

//=============================================================================
