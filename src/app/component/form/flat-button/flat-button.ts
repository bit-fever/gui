//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, Input} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";

//=============================================================================

@Component({
  selector: 'flat-button',
  templateUrl: './flat-button.html',
  styleUrls  :['./flat-button.scss'],
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, NgIf]
})

//=============================================================================

export class FlatButton {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() icon  : string = ""
  @Input() label?: string

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {}
}

//=============================================================================
