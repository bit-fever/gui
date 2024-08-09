//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}         from "@angular/core";
import {MatIconModule}     from "@angular/material/icon";
import {MatToolbarModule}  from "@angular/material/toolbar";
import {MatButtonModule}   from "@angular/material/button";
import {AppEvent, ErrorEvent} from "../../model/event";
import {EventBusService}   from "../../service/eventbus.service";
import {LabelService}      from "../../service/label.service";
import {AbstractPanel} from "../../component/abstract.panel";
import {Router, RouterModule} from "@angular/router";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

//=============================================================================

@Component({
  selector    :   'header-panel',
  templateUrl : './header-panel.html',
	styleUrls   : [ './header-panel.scss' ],
	imports     : [ MatButtonModule, MatIconModule, MatToolbarModule, RouterModule, MatSnackBarModule],
  providers: [
  ],
	standalone  : true
})

//=============================================================================

export class HeaderPanel extends AbstractPanel {

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService : EventBusService,
	            labelService    : LabelService,
              router          : Router,
              private _snackBar: MatSnackBar) {
		super(eventBusService, labelService, router, "header");

    eventBusService.subscribeToError(this.onError)
	}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

	onMenuClick() {
		let event : AppEvent = new AppEvent(AppEvent.MENU_BUTTON_CLICK);
		this.eventBusService.emitToApp(event);
	}

  //-------------------------------------------------------------------------

  private onError = (event : ErrorEvent) => {
    this._snackBar.open(""+ event.error, "Ok")
  }
}

//=============================================================================
