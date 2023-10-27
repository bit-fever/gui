//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {MatSidenav, MatSidenavModule} from "@angular/material/sidenav";

import {AppEvent}             from "../../model/event";
import {AbstractSubscriber}   from "../../service/abstract-subscriber";
import {EventBusService}      from "../../service/eventbus.service";
import {LeftPanel} from "./left-panel/left-panel";
import {WorkPanel} from "./work-panel/work.panel";
import {RightPanel} from "./right-panel/right-panel";

//=============================================================================

@Component({
	selector   :    'main-panel',
	templateUrl:  './main.panel.html',
	styleUrls  : ['./main.panel.scss'],
	imports    : [ MatSidenavModule, RouterModule, LeftPanel, WorkPanel, RightPanel ],
	standalone : true
})

//=============================================================================

export class MainPanel extends AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	@ViewChild('leftNavig')  private leftNavig !: MatSidenav;
	@ViewChild('rightNavig') private rightNavig!: MatSidenav;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService: EventBusService, private router : Router) {

		super(eventBusService);

		//--- Local Fat Arrow is mandatory in order to preserve 'this'

		super.subscribeToApp(AppEvent.ANY, e => this.onAnyEvent(e));

		//--- Custom events

		// super.subscribeToApp(AppEvent.USER_VIEW_OPEN, (e: AppEvent) => this.onUserViewOpen(e));
	}

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

	private onAnyEvent(event : AppEvent) {

		if (event.code == AppEvent.MENU_BUTTON_CLICK) {

			//--- Prevent from opening the left-menu if the right-panel is open

			if ( ! this.rightNavig.opened) {
				this.leftNavig.opened = ! this.leftNavig.opened;
			}
		}
		else {
      if (event.code == AppEvent.RIGHT_PANEL_CLOSE) {
        this.rightNavig.opened = false;
      }
		}
	}

	//-------------------------------------------------------------------------

	// private onLoginSuccess(event : AppEvent) : void {
	// 	this.rightNavig.opened = false;
	// }

	//-------------------------------------------------------------------------

	// private onUserViewOpen(event : AppEvent) : void {
	// 	this.openRightNavig(event.params, "home", "user-view", Events.USER_VIEW_START);
	// }

	//-------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//-------------------------------------------------------------------------

	private openRightNavig(params:any, primary:string, right:string, eventToPropagate:string|null = null) {

		console.log("Opening right panel '"+ right +"' on '"+ primary +"'");

		this.rightNavig.open().then(() => {
			if (eventToPropagate) {
				super.emitToApp(new AppEvent(eventToPropagate, params));
			}
		});

		let outlet : any = {
			primary : primary,
			right   : right
		};

		this.router.navigate([{ outlets: outlet }]);
	}
}

//=============================================================================
