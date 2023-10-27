//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, OnInit} from '@angular/core';
import {NgIf}           from "@angular/common";
import {AuthModule}     from "angular-auth-oidc-client";
import {MainPanel}      from "./main-panel/main.panel";
import {HeaderPanel}    from "./header-panel/header-panel";
import {SessionService} from "../service/session.service";

//=============================================================================

@Component({
	selector   : 'app-root',
	templateUrl:   './app.component.html',
	styleUrls  : [ './app.component.scss'],
  imports:     [HeaderPanel, MainPanel, NgIf, AuthModule],
	standalone : true
})

//=============================================================================

export class AppComponent implements OnInit {

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(public sessionService : SessionService) {}

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  ngOnInit() {
    this.sessionService.checkAuthentication();
  }
}

//=============================================================================
