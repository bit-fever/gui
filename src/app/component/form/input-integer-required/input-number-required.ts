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
  ReactiveFormsModule, ValidatorFn,
  Validators
} from "@angular/forms";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {EventBusService}    from "../../../service/eventbus.service";
import {LabelService}       from "../../../service/label.service";
import {BfErrorStateMatcher} from "../error-state-matcher";

//=============================================================================

@Component({
    selector: 'input-number-required',
    templateUrl: './input-number-required.html',
    styleUrls: ['./input-number-required.scss'],
    imports: [MatFormFieldModule, MatOptionModule, MatInputModule, FormsModule, ReactiveFormsModule, NgIf, MatButtonModule, MatIconModule]
})

//=============================================================================

export class InputNumberRequired extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label : string = ""

  @Output() valueChange = new EventEmitter<any>();

  //-------------------------------------------------------------------------

  formControl = new FormControl<number|undefined>(undefined, [Validators.required])
  matcher    = new BfErrorStateMatcher();

  private _min?  : number
  private _max?  : number
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

  get value() : number|undefined {
    if (this.formControl.value == null) {
      return undefined
    }

    return this.formControl.value
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : number|undefined) {
    this.formControl.setValue(v)
  }

  //-------------------------------------------------------------------------

  get min() : number|undefined {
    return this._min
  }

  //-------------------------------------------------------------------------

  @Input()
  set min(m:number|undefined) {
    this._min = m
    this.updateValidators()
  }

  //-------------------------------------------------------------------------

  get max() : number|undefined {
    return this._max
  }

  //-------------------------------------------------------------------------

  @Input()
  set max(m:number|undefined) {
    this._max = m
    this.updateValidators()
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
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  public loc = (code : string) : string => {
    return this.labelService.getLabelString("errors."+ code);
  }

  //-------------------------------------------------------------------------

  onClear() {
    this.formControl.setValue(undefined)
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

  private updateValidators() {
    let validators = [ Validators.required ]

    if (this._min) {
      validators = [ ...validators, Validators.min(this._min) ]
    }

    if (this._max) {
      validators = [ ...validators, Validators.max(this._max) ]
    }

    this.formControl.setValidators(validators)
    this.formControl.updateValueAndValidity()
  }
}

//=============================================================================
