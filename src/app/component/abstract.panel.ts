//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {AfterViewChecked, AfterViewInit, Injectable, OnDestroy, OnInit} from "@angular/core";

import {AbstractSubscriber} from "../service/abstract-subscriber";
import {EventBusService}    from "../service/eventbus.service";
import {LabelService} from "../service/label.service";
import {Router} from "@angular/router";
import {AppEvent} from "../model/event";

//=============================================================================

@Injectable()
export abstract class AbstractPanel extends AbstractSubscriber implements OnInit, OnDestroy, AfterViewChecked  {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	private pageCode : string;
  private modelCode: string;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	protected constructor(protected override eventBusService : EventBusService,
	            protected labelService : LabelService,
              protected router       : Router,
	            pageCode  : string,
              modelCode?: string) {
		super(eventBusService)
		this.pageCode = pageCode
    this.modelCode= modelCode||""
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
    console.log("Component destroyed: "+this.router.url)
	}

  //---------------------------------------------------------------------------

  public ngAfterViewChecked() {
    this.viewInit();
  }

	//---------------------------------------------------------------------------
	//---
	//--- Hooks methods
	//---
	//---------------------------------------------------------------------------

	protected init    = (): void => {};
	protected destroy = (): void => {};

  protected viewInit = (): void => {};

	//---------------------------------------------------------------------------
	//---
	//--- Public methods
	//---
	//---------------------------------------------------------------------------

	public loc = (code : string) : string => {
		return this.labelService.getLabelString("page."+ this.pageCode +"."+ code);
	}

  //---------------------------------------------------------------------------

  public mod = (code : string) : string => {
    return this.labelService.getLabelString("model."+ this.modelCode +"."+ code);
  }

  //---------------------------------------------------------------------------

  public button = (code : string) : string => {
    return this.labelService.getLabelString("button."+code);
  }

  //---------------------------------------------------------------------------

  public menu = (code : string) : string => {
    return this.labelService.getLabelString("menu-button."+code);
  }

  //---------------------------------------------------------------------------

  public map = (mapCode : string, code : string) : string => {
    return this.labelService.getLabelString("map."+ mapCode +"."+ code);
  }

  //---------------------------------------------------------------------------

  public labelMap = (code : string) : any => {
    return this.labelService.getLabel("page."+ this.pageCode +"."+ code);
  }

  //---------------------------------------------------------------------------

  public openRightPanel(page : string, rightPanel : string, startEvent?: string, params? : any) {
    console.log("Opening right panel '"+ rightPanel +"' on '"+ page +"'");

    let outlet : any = {
      primary : page,
      right   : rightPanel
    };

    this.router.navigate([{ outlets: outlet }]).then( () => {
      super.emitToApp(new AppEvent(AppEvent.RIGHT_PANEL_OPEN, params, startEvent))
    });
  }

  //---------------------------------------------------------------------------

  public navigateTo(urlFragments : any[]) : Promise<boolean> {
    return this.router.navigate(urlFragments);
  }
}

//=============================================================================
