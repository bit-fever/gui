//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, OnInit} from '@angular/core';
import {NgIf}           from "@angular/common";
import {MainPanel}      from "./main-panel/main.panel";
import {HeaderPanel}    from "./header-panel/header-panel";
import {SessionService} from "../service/session.service";
import {DocEditor} from "../portal/doc-editor/doc-editor";
import {PortalModule} from "@angular/cdk/portal";
import {PortalService} from "../service/portal.service";
import {LabelService} from "../service/label.service";
import {MenuService} from "../service/menu.service";

//=============================================================================

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [HeaderPanel, MainPanel, NgIf, PortalModule, DocEditor]
})

//=============================================================================

export class AppComponent implements OnInit {

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(public sessionService : SessionService,
              public labelService   : LabelService,
              public menuService    : MenuService,
              public portalService  : PortalService) {}

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
