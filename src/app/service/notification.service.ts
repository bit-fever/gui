//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable} from '@angular/core';
// import {MessageService} from "primeng/api";

//=============================================================================

@Injectable()
export class NotificationService {

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	// constructor(private messageService:MessageService) {
	// }

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	public showSuccess(title : string, message : string) : void {
		this.show('success', title, message);
	}

	//-------------------------------------------------------------------------

	public showInfo(title : string, message : string) : void {
		this.show('info', title, message);
	}

	//-------------------------------------------------------------------------

	public showWarn(title : string, message : string) : void {
		this.show('warn', title, message);
	}

	//-------------------------------------------------------------------------

	public showError(title : string, message : string) : void {
		this.show('error', title, message);
	}

	//-------------------------------------------------------------------------

	public show(severity : string, title : string, message : string) : void {

		// this.messageService.add( {
		// 	severity: severity,
		// 	summary : title,
		// 	detail  : message
		// });
	}
}

//=============================================================================
