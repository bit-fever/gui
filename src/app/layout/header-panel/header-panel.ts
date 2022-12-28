//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}    from "@angular/core";

import { AppEvent }        from "../../model/event";
import { EventbusService } from "../../service/eventbus.service";
import { LabelService }    from "../../service/label.service";

//=============================================================================

@Component({
    selector    :   'header-panel',
    templateUrl : './header-panel.html',
	styleUrls   : [ './header-panel.scss' ]
})

//=============================================================================

export class HeaderPanel {

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

  constructor(private labelService    : LabelService,
              private eventBusService : EventbusService
 	) {}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	loc(key : string) : string {
		return this.labelService.getLabel("app", key);
	}

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onMenuClick() {
    let event : AppEvent = new AppEvent(AppEvent.MENU_BUTTON_CLICK);
    this.eventBusService.emitToApp(event);
  }
}

//=============================================================================
