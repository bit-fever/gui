//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {NgIf} from "@angular/common";
import {
  AbstractControl,
  FormControl,
  FormControlStatus,
  ReactiveFormsModule,
  ValidationErrors,
} from "@angular/forms";
import {BfErrorStateMatcher} from "../error-state-matcher";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {DateAdapter, MatNativeDateModule} from "@angular/material/core";
import {IntDateAdapter} from "./int-date-adapter";

//=============================================================================

@Component({
  selector    :   'date-picker',
  templateUrl :   'date-picker.html',
  styleUrls   : [ 'date-picker.scss' ],
  imports     : [MatFormFieldModule, MatInputModule, MatDatepickerModule, NgIf, ReactiveFormsModule, MatNativeDateModule],
  providers   : [{provide: DateAdapter, useClass: IntDateAdapter}],
  standalone  : true
})

//=============================================================================

export class DatePicker extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label    : string  = ""
  @Input() required : boolean = false
  @Input() disabled : boolean = false

  @Output() valueChange = new EventEmitter<number|null>();

  //-------------------------------------------------------------------------

  formControl = new FormControl<number|null>(null)
  matcher    = new BfErrorStateMatcher();

  private _valid : boolean = false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService, private labelService : LabelService) {
    super(eventBusService)
    this.formControl.setValidators(this.validator)
    this.formControl.statusChanges.subscribe(this.valueChanged)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get value() : number|null {
    return this.formControl.value
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : number|null) {
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

  public isValid = () : boolean => {
    return this._valid
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

  //-------------------------------------------------------------------------

  private validator = (control: AbstractControl<number|null>): ValidationErrors | null => {
    console.log("Validating : "+control.value)

    if (this.required && control.value == null) {
      console.log("Required!!!")
      return { "required": "-" }
    }

    return null
  }
}

//=============================================================================
