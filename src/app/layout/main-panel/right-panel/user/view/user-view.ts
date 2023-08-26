//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { Component } from '@angular/core';

// import {AppEvent}            from "@hpe/angular-toolkit/model";
// import {RowSelectedEvent}    from "@hpe/angular-toolkit/model";
// import {AbstractSubscriber}  from "@hpe/angular-toolkit/service";
// import {LabelService}        from "@hpe/angular-toolkit/service";
// import {NotificationService} from "@hpe/angular-toolkit/service";
// import {EventbusService}     from "@hpe/angular-toolkit/service";
//
// import {Events} from "../../../../../../model/event";
// import {User}   from "../../../../../../model/user";

//=============================================================================

@Component({
	selector    :     'user-view',
	templateUrl :   './user-view.html',
	styleUrls   : [ './user-view.scss' ],
  standalone  : true
})

//=============================================================================

export class UserViewPanel { //extends AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

//	public user : User = new User();

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	// constructor(        eventBusService     : EventbusService,
	//             private notificationService : NotificationService,
	//             private labelService        : LabelService) {
  //
	// 	super(eventBusService);
	// 	super.subscribeToApp(Events.USER_VIEW_START, (e : AppEvent) => this.onStart(e));
	// }

	//-------------------------------------------------------------------------
	//---
	//--- Template methods
	//---
	//-------------------------------------------------------------------------

	// get userStatus() {
	// 	return this.labelService.getMapping("userStatus");
	// }

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

	// private onStart(event : AppEvent) : void {
	// 	console.log("UserViewPanel: Starting...");
  //
	// 	let rse : RowSelectedEvent = event.params;
	// 	this.user = rse.row;
	// }

	//-------------------------------------------------------------------------

	// public onSave() : void {
  //
	// 	console.log("Modified User is : \n"+ JSON.stringify(this.user));
  //
	// 	this.notificationService.showSuccess("Success", "User information successfully updated.")
	// 	this.onClose();
	// }

	//-------------------------------------------------------------------------

	// public onClose() : void {
  //
	// 	let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
	// 	super.emitToApp(event);
	// }
}

//=============================================================================
