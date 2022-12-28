//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component} from '@angular/core';
import {MenuService} from "../../../service/menu.service";
import {Roles} from "../../../model/user/roles";
import { SidebarModes, UnAuthorizedVisibility } from '../../../component/sidebar-menu/model';
import {LabelService} from "../../../service/label.service";

//=============================================================================

@Component({
  selector    :     'left-panel',
  templateUrl :   './left-panel.html',
	styleUrls   : [ './left-panel.scss' ]
})

//=============================================================================

export class LeftPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  title              = 'angular-sidebar-menu';
  currentRole        = Roles.EDITOR;
  currentSidebarMode = SidebarModes.EXPANDED;
  currentSearch     ?: string;
  inputSearchFocus     = false;
  visibility : UnAuthorizedVisibility = "hidden";

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

  constructor(public menuService : MenuService,
              public labelService: LabelService) {
	}

	//-------------------------------------------------------------------------
	//---
	//--- API method
	//---
	//-------------------------------------------------------------------------

}

//=============================================================================
