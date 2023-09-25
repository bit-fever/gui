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
import {LabelService} from "../service/label.service";

//=============================================================================

@Injectable()
export abstract class AbstractPanel extends AbstractSubscriber implements OnInit, OnDestroy {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	private pageCode : string;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(protected override eventBusService : EventBusService,
	            protected labelService : LabelService,
	            pageCode : string) {
		super(eventBusService)
		this.pageCode = pageCode;
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

	//---------------------------------------------------------------------------
	//---
	//--- Public methods
	//---
	//---------------------------------------------------------------------------

	public loc = (code : string) : string => {
		return this.labelService.getLabelString("page."+ this.pageCode +"."+ code);
	}

  //---------------------------------------------------------------------------

  public button = (code : string) : string => {
    return this.labelService.getLabelString("button."+code);
  }

  //---------------------------------------------------------------------------

  public labelMap = (code : string) : any => {
    return this.labelService.getLabel("page."+ this.pageCode +"."+ code);
  }
}

//=============================================================================
