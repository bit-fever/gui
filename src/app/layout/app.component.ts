//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}   from '@angular/core';
import {MainPanel}   from "./main-panel/main.panel";
import {HeaderPanel} from "./header-panel/header-panel";

//=============================================================================

@Component({
	selector   : 'app-root',
	templateUrl: './app.component.html',
	styleUrls  : [ './app.component.scss'],
	imports    : [ HeaderPanel, MainPanel ],
	standalone : true
})

//=============================================================================

export class AppComponent {
}

//=============================================================================
