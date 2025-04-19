//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable, ApplicationRef, Injector} from '@angular/core';
import {DomPortalOutlet} from "@angular/cdk/portal";

//=============================================================================

@Injectable()
export class PortalService {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  showDocEditor = false
  docEditorTsId = 0

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
    let extWindow = window.open('doc-editor/edit/'+tsId, '', 'popup,width=1500,height=950,left=100,top=100');

    if (extWindow == null) {
      console.log("DocEditor's window is null")
      return
    }
  }

  // public openDocEditor(tsId:number) {
  //   if (this.showDocEditor) {
  //     return
  //   }
  //
  //   this.docEditorTsId = tsId
  //   this.showDocEditor = true
  // }
}

//=============================================================================
