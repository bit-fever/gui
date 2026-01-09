//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable} from '@angular/core';

//=============================================================================

@Injectable()
export class ModuleService {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {}

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public openDocEditor(tsId:number) {
    let extWindow = window.open('module/doc-editor/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("DocEditor's window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openPerformanceMetrics(tsId:number) {
    let extWindow = window.open('module/performance-analysis/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("PerformanceMetrics' window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openQualityAnalyzer(tsId:number) {
    let extWindow = window.open('module/quality-analysis/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("QualityAnalyzer's window is null")
    }
  }

  //-------------------------------------------------------------------------

  public openSimulator(tsId:number) {
    let extWindow = window.open('module/simulation/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("Simulator's window is null")
    }
  }
}

//=============================================================================
