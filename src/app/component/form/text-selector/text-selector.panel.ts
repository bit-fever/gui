//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {EventBusService} from "../../../service/eventbus.service";
import {LabelService} from "../../../service/label.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormControlStatus, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AbstractSubscriber} from "../../../service/abstract-subscriber";
import {BfErrorStateMatcher} from "../error-state-matcher";

//=============================================================================

@Component({
    selector: 'text-selector',
    templateUrl: './text-selector.panel.html',
    styleUrls: [ './text-selector.panel.scss'],
  imports: [CommonModule, MatFormFieldModule, MatInput, FormsModule, MatIconButton, MatIcon, ReactiveFormsModule]
})

//=============================================================================

export class TextSelectorPanel extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() label? : string

  text? : string

  @Output() valueChange : EventEmitter<string|null> = new EventEmitter<string|null>();

  //-------------------------------------------------------------------------

  formControl = new FormControl('', [Validators.required])
  matcher = new BfErrorStateMatcher();

  private _valid    = false
  private _disabled = false

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService, private labelService : LabelService) {
    super(eventBusService);
    this.formControl.statusChanges.subscribe(this.valueChanged)
    this.formControl.disable()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get value() : string|undefined {
    let val = this.formControl.value

    return (val==null) ? undefined : val
  }

  //-------------------------------------------------------------------------

  @Input()
  set value(v : string|undefined) {
    if (v == undefined) {
      this.formControl.setValue(null)
    }
    else {
      this.formControl.setValue(v)
    }
  }

  //-------------------------------------------------------------------------

  get disabled() : boolean {
    return this._disabled
  }

  //-------------------------------------------------------------------------

  @Input()
  set disabled(v : boolean) {
    this._disabled = v
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

  onSearch() {
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
