//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component}    from '@angular/core';
import {RouterModule} from "@angular/router";
import {NgIf} from "@angular/common";
import {LabelService} from "../../../service/label.service";

//=============================================================================

@Component({
  selector     :   'work-panel',
  templateUrl  : './work.panel.html',
	styleUrls    : [ './work.panel.scss' ],
	imports      : [RouterModule, NgIf],
	standalone   : true
})

//=============================================================================

export class WorkPanel {

  //---------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //---------------------------------------------------------------------------

  constructor(protected labelService:LabelService) {
  }
}

//=============================================================================
