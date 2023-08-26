//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}    from '@angular/core';
import {LabelService} from "../../../../service/label.service";
import {MatIconModule} from "@angular/material/icon";

//=============================================================================

@Component({
	selector    :     'unknown',
	templateUrl :   './unknown.panel.html',
	styleUrls   : [ './unknown.panel.scss' ],
	imports     : [ MatIconModule ],
	standalone  : true
})

//=============================================================================

export class UnknownPanel {

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(private labelService : LabelService) {
	}

	//-------------------------------------------------------------------------
	//---
	//--- API method
	//---
	//-------------------------------------------------------------------------

	get message() : string {
		return this.labelService.getLabel("unknown-url", "message");
	}
}

//=============================================================================
