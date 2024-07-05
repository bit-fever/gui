//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}  from '@angular/core';

// import {ListBackendService}  from "@hpe/angular-toolkit/model";
// import {ListTableColumn}     from "@hpe/angular-toolkit/model";
// import {AbstractSubscriber, LabelService} from "@hpe/angular-toolkit/service";
// import {EventbusService}     from "@hpe/angular-toolkit/service";
//
// import {UserService}        from "../../../../../service/user-service";
// import {MenuService}        from "../../../../../service/menu-service";
// import {User}               from "../../../../../model/user";
// import {ListPanelService}   from "../../../../../service/listpanel-service";

//=============================================================================

@Component({
	selector    :     'home-panel',
	templateUrl :   './home.panel.html',
	styleUrls   : [ './home.panel.scss' ],
  standalone  : true
})

//=============================================================================

export class HomePanel { //extends AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------
	// allUsersService: ListBackendService<User>;
	// userAllCols : ListTableColumn[];
	// userVisCols : string[];
	// userPopupMenu : MenuItem[];

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	// constructor(        eventBusService : EventbusService,
	// 			private userService     : UserService,
	// 			private menuService     : MenuService,
	// 			private listPanelService: ListPanelService,
	//             private labelService    : LabelService) {
  //
	// 	super(eventBusService);
  //
	// 	this.allUsersService = () => this.userService.getAllUsers();
  //
	// 	this.userAllCols = listPanelService.userAllColumns();
	// 	this.userVisCols = listPanelService.userVisColumns();
  //
	// 	this.userPopupMenu = this.menuService.popUpUsers();
	// }

	//-------------------------------------------------------------------------
	//---
	//--- Template methods
	//---
	//-------------------------------------------------------------------------

	// loc(code : string) : string {
	// 	return this.labelService.getLabel("home", code);
	// }
}

//=============================================================================
