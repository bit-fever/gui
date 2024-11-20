//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

//=============================================================================
//===
//=== Events
//===
//=============================================================================

export class AppEvent<T = any>  {

	//-------------------------------------------------------------------------

	constructor(public code           : string,
              public params?        : T,
              public propagateCode? : string) {}

	//-------------------------------------------------------------------------
	//--- System events
	//-------------------------------------------------------------------------

	static ANY                : string = "*";
	static SUBMIT_START       : string = "submit.start";
	static SUBMIT_END         : string = "submit.end";
  static LOCALIZATION_READY : string = "localization.ready";
  static PRESETS_READY      : string = "presets.ready";
	static LOGIN_SUCCESS      : string = "login.success";
	static LOGIN_FAILED       : string = "login.failed";
	static LOGOUT_SUCCESS     : string = "logout.success";
	static LOGOUT_FAILED      : string = "logout.failed";
	static INVALID_TOKEN      : string = "invalid.token";
	static APPLICATION_READY  : string = "app.ready";

	static MENU_BUTTON_CLICK  : string = "menu.button.click";
  static RIGHT_PANEL_OPEN   : string = "right.panel.open";
	static RIGHT_PANEL_CLOSE  : string = "right.panel.close";

  static CONNECTION_LIST_RELOAD  : string = "connection.list.reload";
  static CONNECTION_CREATE_START : string = "connection.create.start";
  static CONNECTION_EDIT_START   : string = "connection.edit.start";

  static TRADINGSYSTEM_LIST_RELOAD: string = "tradingSystem.list.reload";
  static TRADINGSYSTEM_EDIT_START : string = "tradingSystem.edit.start";

  static DATAPRODUCT_LIST_RELOAD   : string = "dataProduct.list.reload";
  static DATAPRODUCT_CREATE_START  : string = "dataProduct.create.start";
  static DATAPRODUCT_EDIT_START    : string = "dataProduct.edit.start";
  static DATAINSTRUMENT_LIST_RELOAD: string = "dataInstrument.list.reload";

  static BROKERPRODUCT_LIST_RELOAD : string = "brokerProduct.list.reload";
  static BROKERPRODUCT_CREATE_START: string = "brokerProduct.create.start";
  static BROKERPRODUCT_EDIT_START  : string = "brokerProduct.edit.start";

  static BIASANALYSIS_LIST_RELOAD  : string = "biasAnalysis.list.reload";
  static BIASANALYSIS_CREATE_START : string = "biasAnalysis.create.start";
  static BIASANALYSIS_EDIT_START   : string = "biasAnalysis.edit.start";
}

//=============================================================================

export interface EventHandler {
	(event : AppEvent) : void;
}

//=============================================================================
//===
//=== Errors
//===
//=============================================================================

export class ErrorEvent {
	code : string | null;
	error: string | null;

  constructor() {
    this.code  = null;
    this.error = null;
  }
}

//=============================================================================

export interface ErrorHandler {
	(event : ErrorEvent) : void;
}

//=============================================================================
