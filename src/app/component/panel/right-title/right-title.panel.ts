//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule}    from "@angular/material/icon";
import {MatButtonModule}  from "@angular/material/button";


//=============================================================================

@Component({
  selector    :     'right-title-panel',
  templateUrl :   './right-title.panel.html',
  styleUrls   : [ './right-title.panel.scss' ],
  imports     : [ MatToolbarModule, MatIconModule, MatButtonModule],
  standalone  : true
})

//=============================================================================

export class RightTitlePanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() icon?  : string;
  @Input() title? : string;

  //-------------------------------------------------------------------------

  @Output() onClose : EventEmitter<Event> = new EventEmitter<Event>();

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------
}

//=============================================================================
