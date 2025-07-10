//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  FormControl,
  FormControlStatus,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {EventBusService}    from "../../../service/eventbus.service";
import {LabelService}       from "../../../service/label.service";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {Setting} from "../../../model/setting";

//=============================================================================

@Component({
  selector: 'toggle-button',
  templateUrl: './toggle-button.html',
  styleUrls: ['./toggle-button.scss'],
  imports: [FormsModule, ReactiveFormsModule, MatButtonToggleModule]
})

//=============================================================================

export class ToggleButton {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input()  label        = ""
  @Output() checkedChange = new EventEmitter<boolean>()

  formControl = new FormControl<string[]>([""])

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get checked() : boolean {
    // @ts-ignore
    return this.formControl.value[0] == "true"
  }

  //-------------------------------------------------------------------------

  @Input()
  set checked(v : boolean) {
    this.formControl.setValue([v +""])
  }

  //-------------------------------------------------------------------------

  get disabled() : boolean {
    return this.formControl.disabled
  }

  //-------------------------------------------------------------------------

  @Input()
  set disabled(v : boolean) {
    if (v) {
      this.formControl.disable()
    }
    else {
      this.formControl.enable()
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onValueChange() {
    // @ts-ignore
    this.checkedChange.emit(this.formControl.value[0] == "true")
  }
}

//=============================================================================

