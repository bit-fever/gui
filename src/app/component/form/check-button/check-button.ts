//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CheckButtonConfig} from "./check-button-config";
import {LabelService} from "../../../service/label.service";

//=============================================================================

@Component({
    selector: 'check-button',
    templateUrl: './check-button.html',
    styleUrls: ['./check-button.scss'],
    imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule]
})

//=============================================================================

export class CheckButton {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() config = new CheckButtonConfig("","","","","","", "")
  @Input() status : boolean = false

  @Output() valueChange = new EventEmitter<CheckButton>();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  activeIcon() : string {
    return (this.status) ? this.config.onIcon : this.config.offIcon
  }

  //-------------------------------------------------------------------------

  activeLabel() : string {
    let label = (this.status) ? this.config.onLabel : this.config.offLabel
    return this.labelService.getLabelString(this.config.labelRoot +"."+ label)
  }

  //-------------------------------------------------------------------------

  activeColor() : string {
    return (this.status) ? this.config.onColor : this.config.offColor
  }

  //-------------------------------------------------------------------------

  onClick = () => {
    this.valueChange.emit(this)
  }
}

//=============================================================================
