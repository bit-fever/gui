//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {MatCheckboxChange, MatCheckboxModule} from "@angular/material/checkbox";
import {NgForOf, NgIf} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {DialogData} from "./dialog-data";
import {InputTextRequired} from "../../../../../../component/form/input-text-required/input-text-required";
import {SystemAdapterService} from "../../../../../../service/system-adapter.service";
import {
  AdapterParam,
  ConnectionRequest,
  ConnectionResultStatusConnected, ConnectionResultStatusConnecting, ConnectionResultStatusError,
} from "../../../../../../model/model";
import {areAdapterParamsValid, buildParamMap} from "../param-utils";

//=============================================================================

@Component({
  selector: 'system-login-dialog',
  templateUrl: 'system-login.dialog.html',
  styleUrls : ['system-login.dialog.scss'],
  imports: [MatDialogModule, MatButtonModule, MatCheckboxModule,
    NgIf, InputTextRequired, MatTabsModule, NgForOf]
})

//=============================================================================

export class SystemLoginDialog extends AbstractPanel {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  loginDisabled= true
  loggingIn    = false
  error          = ""

  connectParams : AdapterParam[] = []

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService             : EventBusService,
              labelService                : LabelService,
              router                      : Router,
              private systemAdapterService: SystemAdapterService,
              private dialogRef           : MatDialogRef<SystemLoginDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    super(eventBusService, labelService, router, "admin.connection.login");

    this.systemAdapterService.getAdapter(data.conn.systemCode).subscribe( a => {
      if (a.connectParams != undefined && a.connectParams.length > 0) {
        this.connectParams = a.connectParams;
      }
      this.loginDisabled = false
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- General methods
  //---
  //-------------------------------------------------------------------------

  public label(code : string) : string {
    return this.labelService.getLabelString("adapter."+ this.data.conn.systemCode +"."+ code);
  }

  //-------------------------------------------------------------------------

  onCheckChange(e : MatCheckboxChange, p : AdapterParam) {
    p.valueBool = e.checked
  }

  //-------------------------------------------------------------------------

  onLogin() {
    let cr = new ConnectionRequest()
    cr.systemCode    = this.data.conn.systemCode
    cr.configParams  = JSON.parse(this.data.conn.systemConfigParams)
    cr.connectParams = buildParamMap(this.connectParams)

    this.loginDisabled = true
    this.loggingIn     = true
    this.error         = ""

    this.systemAdapterService.connect(this.data.conn.code, cr).subscribe( res => {
      if (res.status == ConnectionResultStatusConnected) {
        this.dialogRef.close(true)
      }
      else if (res.status == ConnectionResultStatusConnecting) {
        window.open(res.message, "_blank", "popup")
        this.dialogRef.close(true)
      }
      else if (res.status == ConnectionResultStatusError) {
        this.error         = res.message
        this.loginDisabled = false
        this.loggingIn     = false
      }
    })
  }

  //-------------------------------------------------------------------------

  paramsAreValid() : boolean {
    return areAdapterParamsValid(this.connectParams)
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private resetOptions() {
  }
}

//=============================================================================
