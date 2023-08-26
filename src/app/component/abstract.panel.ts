//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable, OnDestroy, OnInit} from "@angular/core";

import {AbstractSubscriber} from "../service/abstract-subscriber";
import {EventBusService}    from "../service/eventbus.service";

//=============================================================================

@Injectable()
export abstract class AbstractPanel extends AbstractSubscriber implements OnInit, OnDestroy {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------


	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService : EventBusService) {
		super(eventBusService)
	}

	//-------------------------------------------------------------------------
	//---
	//--- Lifecycle methods
	//---
	//-------------------------------------------------------------------------

	public ngOnInit(): void {
		this.init();
	}

	//-------------------------------------------------------------------------

	public ngOnDestroy() {
		super.removeAllSubscriptions();
		this.destroy();
	}

	//---------------------------------------------------------------------------
	//---
	//--- Hooks methods
	//---
	//---------------------------------------------------------------------------

	protected init    = (): void => {};
	protected destroy = (): void => {};
}

//=============================================================================
