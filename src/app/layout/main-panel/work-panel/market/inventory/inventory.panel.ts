//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}  from '@angular/core';

import {AbstractSubscriber} from "../../../../../service/abstract-subscriber";
import {LabelService}       from "../../../../../service/label.service";
import {EventbusService}    from "../../../../../service/eventbus.service";

//=============================================================================

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
	selector    :     'market-inventory',
	templateUrl :   './inventory.panel.html',
	styleUrls   : [ './inventory.panel.scss' ]
})

//=============================================================================

export class MarketInventoryPanel extends AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  marketList : PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];

  //-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(        eventBusService : EventbusService,
	            private labelService    : LabelService) {

		super(eventBusService);
	}

	//-------------------------------------------------------------------------
	//---
	//--- Template methods
	//---
	//-------------------------------------------------------------------------

	loc(code : string) : string {
		return this.labelService.getLabel("markets.inventory", code);
	}

  //-------------------------------------------------------------------------

  onRowClick(row : PeriodicElement) : void {
    console.log(JSON.stringify(row));
  }
}

//=============================================================================
