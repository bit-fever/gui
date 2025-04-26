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
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {MatIconModule}      from "@angular/material/icon";
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
import {MatSelectModule} from "@angular/material/select";
import {BfErrorStateMatcher} from "../error-state-matcher";

//=============================================================================

@Component({
    selector: 'select-required',
    templateUrl: './select-required.html',
    styleUrls: ['./select-required.scss'],
    imports: [MatFormFieldModule, MatOptionModule, MatSelectModule, MatIconModule,
        NgIf, FormsModule, ReactiveFormsModule, NgForOf]
})

//=============================================================================

export class SelectRequired extends AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	@Input() label     : string = ""
	@Input() keyField  : string = ""
	@Input() valueField: string = ""
  @Input() list      : any[]  = []
  @Input() map       : Object = {}

  @Output() keyChange = new EventEmitter<any>();

  //-------------------------------------------------------------------------

	formControl = new FormControl<any>('', [Validators.required])
	matcher = new BfErrorStateMatcher();

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

  get key() : any {
    return this.formControl.value
  }

  //-------------------------------------------------------------------------

  @Input()
  set key(v : any) {
    this.formControl.setValue(v)
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

  public isValid = () : boolean => {
    return this._valid
  }

  //-------------------------------------------------------------------------

  public mapKeys() {
    return Object.keys(this.map);
  }

  //-------------------------------------------------------------------------

  public mapValue(key : string) : string {
    // @ts-ignore
    return this.map[key];
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private valueChanged = (s : FormControlStatus) => {
    this._valid = (s == "VALID")
    this.keyChange.emit(this.formControl.value)
  }
}

//=============================================================================

