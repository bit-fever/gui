//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ErrorStateMatcher, MatOptionModule} from "@angular/material/core";
import {NgForOf, NgIf}      from "@angular/common";
import {MatInputModule}     from "@angular/material/input";
import {MatIconModule}      from "@angular/material/icon";
import {MatButtonModule}    from "@angular/material/button";
import {
  FormControl,
  FormControlStatus,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {EventBusService}    from "../../../service/eventbus.service";
import {LabelService}       from "../../../service/label.service";

//=============================================================================

@Component({
  selector    :     'input-int-required',
  templateUrl :   './input-int-required.html',
  styleUrls   : [ './input-int-required.scss' ],
  imports     : [ MatFormFieldModule, MatOptionModule, MatInputModule, FormsModule, ReactiveFormsModule],
  standalone  : true
})

//=============================================================================

export class InputIntRequired extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label : string = ""
  @Input() min   : number = 0
  @Input() max   : number = 0

  @Output() valueChange = new EventEmitter<any>();

  //-------------------------------------------------------------------------

  formControl = new FormControl()

  private _valid : boolean= false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService, private labelService : LabelService) {
    super(eventBusService)
    this.formControl.statusChanges.subscribe(this.valueChanged)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get value() : number {
    return this.formControl.value
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : number) {
    this.formControl.setValue(v)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  public loc = (code : string) : string => {
    return this.labelService.getLabelString("errors."+ code);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private valueChanged = (s : FormControlStatus) => {
    this._valid = (s == "VALID")
    this.valueChange.emit(this.formControl.value)
  }
}

//=============================================================================
