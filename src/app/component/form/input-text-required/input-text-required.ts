//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
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
  selector    :     'input-text-required',
  templateUrl :   './input-text-required.html',
  styleUrls   : [ './input-text-required.scss' ],
  imports     : [ MatFormFieldModule, MatOptionModule, NgForOf, MatInputModule, MatIconModule,
                  MatButtonModule, NgIf, FormsModule, ReactiveFormsModule],
  standalone  : true
})

//=============================================================================

export class InputTextRequired extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label? : string

  @Output() valueChange = new EventEmitter<any>();

  //-------------------------------------------------------------------------

  formControl = new FormControl()
  matcher = new MyErrorStateMatcher();

  private _len   : number = 1
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

  get value() : any {
    return this.formControl.value
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : any) {
    this.formControl.setValue(v)
  }

  //-------------------------------------------------------------------------

  get len() : number {
    return this._len
  }

  //-------------------------------------------------------------------------

  @Input()
  set len(l:number) {
    this._len = l
    this.formControl.setValidators([ Validators.required, Validators.maxLength(l) ])
    this.formControl.updateValueAndValidity()
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
    this.formControl.setValue('')
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
}

//=============================================================================

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

//=============================================================================
