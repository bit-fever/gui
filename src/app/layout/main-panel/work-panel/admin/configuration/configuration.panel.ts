//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { Component } from '@angular/core';

import {MatCardModule} from "@angular/material/card";
import {Configuration} from "../../../../../model/config";
import {LabelService}  from "../../../../../service/label.service";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {AbstractPanel} from "../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../service/eventbus.service";
import {MatButtonModule} from "@angular/material/button";

//=============================================================================

@Component({
	selector	:    'configuration-panel',
	templateUrl	:  './configuration.panel.html',
	styleUrls   : ['./configuration.panel.scss' ],
	imports     : [ MatCardModule, MatIconModule, MatDividerModule, MatButtonModule ],
	standalone  : true
})

//=============================================================================

export class ConfigurationPanel extends AbstractPanel {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	public config : Configuration = {
		"language"     : "en",
		"debugEnabled" : true
	};

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService : EventBusService,
	            labelService    : LabelService) {
		super(eventBusService, labelService, "admin.config");
		this.config.language = labelService.getLanguage();
	}

	//-------------------------------------------------------------------------
	//---
	//--- Template methods
	//---
	//-------------------------------------------------------------------------

	// get languages() : any {
	// 	return this.labelService.getMapping("languages");
	// }

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

// 	onSave() {
//
// 		console.log("Configuration : \n"+ JSON.stringify(this.config));
//
// 		//--- Examples of notifications that can occur during data saving
//
// //		this.notificationService.showError  ("Form error",        "Missing mandatory data");
// //		this.notificationService.showWarn   ("Operation warning", "Some operations where skipped");
// //		this.notificationService.showInfo   ("Info title",        "Entering out of scope area");
// 		this.notificationService.showSuccess("Success",           "The system settings have been updated");
//
// 		this.labelService.setLanguage(this.config.language);
// 	}
}

//=============================================================================
