//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {AdapterParam} from "../../../../../model/model";

//=============================================================================

export function initParameters(list : AdapterParam[]) : AdapterParam[] {
  if (list == null) {
    return []
  }

  list.forEach(p => {
    switch (p.type) {
      case "string":
        p.valueStr = p.defValue
        break;
      case "password":
        p.valueStr = ""
        break;
      case "int":
        p.valueInt = Number(p.defValue)
        break;
      case "bool":
        p.valueBool = p.defValue == "true"
        break;
    }
  })

  return list
}

//=============================================================================

export function areAdapterParamsValid(params : AdapterParam[]) : boolean {
  let valid = true

  if (params != undefined) {
    params.forEach( p => {
      if (!p.nullable) {
        if (p.type == "string" || p.type == "password") {
          if (p.valueStr != undefined && p.valueStr.trim() == "") {
            valid = false
          }
        }
        else if (p.type == "int") {
        }
      }
    })
  }

  return valid
}

//=============================================================================

export function createConfig(params : AdapterParam[]) : string {
  if (params == undefined) {
    return ""
  }

  let map = buildParamMap(params)
  return JSON.stringify(map)
}

//=============================================================================

export function buildParamMap(params : AdapterParam[]|undefined) : any {
  let map : any = {}

  params?.forEach( p => {
    switch (p.type) {
      case "string":
      case "password":
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

//=============================================================================
