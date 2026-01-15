//=============================================================================
//===
//=== Copyright (C) 2026 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AdapterParam} from "../../model/model";
import {LabelService} from "../../service/label.service";
import {InputTextRequired} from "../form/input-text-required/input-text-required";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {SelectRequired} from "../form/select-required/select-required";

//=============================================================================

@Component({
  selector: 'custom-params',
  templateUrl: './custom-params.html',
  styleUrls: [ './custom-params.scss'],
  imports: [MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatIconModule, InputTextRequired, MatCheckbox, SelectRequired]
})

//=============================================================================

export class CustomParams {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Output() valuesChange = new EventEmitter<{[index: string]:any}>();

  private _systemCode : string          = "";
  private _params     : AdapterParam[]  = []
  private _values     : {[index: string]:any} = {}

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  //-------------------------------------------------------------------------
  //--- SystemCode
  //-------------------------------------------------------------------------

  @Input()
  set systemCode(code : string) {
    this._systemCode = "";

    if (code != undefined) {
      this._systemCode = code
      this.initParameters()
    }
  }

  //-------------------------------------------------------------------------

  get systemCode() : string {
    return this._systemCode
  }

  //-------------------------------------------------------------------------
  //--- Params
  //-------------------------------------------------------------------------

  @Input()
  set params(params : AdapterParam[]) {
    this._params = [];

    if (params != undefined) {
      this._params = params
      this.initParameters()
    }
  }

  //-------------------------------------------------------------------------

  get params() : AdapterParam[] {
    return this._params
  }

  //-------------------------------------------------------------------------
  //--- Values
  //-------------------------------------------------------------------------

  @Input()
  set values(values : {[index: string]:any}) {
    this._values = {}

    if (values != undefined) {
      this._values = values
      this.initParameters()
    }
  }

  //-------------------------------------------------------------------------

  get values() : {[index: string]:any} {
    let map : {[index: string]:any} = {}

    this._params.forEach( p => {
      switch (p.type) {
        case "string":
        case "password":
        case "list":
          map[p.name] = p.valueStr
          break;

        case "bool":
          map[p.name] = p.valueBool
          break;

        case "int":
          map[p.name] = p.valueInt
          break;
      }
    })

    return map
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  public label(code : string) : string {
    return this.labelService.getLabelString("adapter."+ this._systemCode +"."+ code +".label");
  }

  //-------------------------------------------------------------------------

  public areParamsValid() : boolean {
    let valid = true

    this._params.forEach( p => {
      if (!p.nullable) {
        if (p.type == "string" || p.type == "password" || p.type == "list") {
          if (p.valueStr != undefined && p.valueStr.trim() == "") {
            valid = false
          }
        }
        else if (p.type == "int") {
        }
      }
    })

    return valid
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onCheckChange(e : MatCheckboxChange, p : AdapterParam) {
    p.valueBool = e.checked
    this.valuesChange.emit(this.values)
  }

  //-------------------------------------------------------------------------

  onValueChange() {
    this.valuesChange.emit(this.values)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private initParameters() {
    this._params.forEach(p => {
      let value = undefined
      if (this._values != undefined) {
        value = this._values[p.name]
      }

      switch (p.type) {
        case "string":
        case "password":
        case "list":
          if (value != undefined) {
            p.valueStr = value
          }
          else {
            p.valueStr           = p.defValue
            this._values[p.name] = p.defValue
          }

          if (p.type == "list") {
            p.valueMap = this.labelService.getLabel("adapter."+ this._systemCode +"."+ p.name +".values")
          }
          break;


        case "int":
          if (value != undefined) {
            p.valueInt = value
          }
          else {
            p.valueInt           = Number(p.defValue)
            this._values[p.name] = Number(p.defValue)
          }
          break;


        case "bool":
          if (value != undefined) {
            p.valueBool = value
          }
          else {
            p.valueBool          = p.defValue == "true"
            this._values[p.name] = p.defValue == "true"
          }
          break;
      }
    })
  }
}

//=============================================================================
