//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {AbstractPanel} from "../../../../../../component/abstract.panel";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {LabelService} from "../../../../../../service/label.service";
import {DialogData} from "./dialog-data";
import {SystemAdapterService} from "../../../../../../service/system-adapter.service";
import {
  AdapterParam,
  ConnectionRequest,
  ConnectionResultStatusConnected, ConnectionResultStatusConnecting, ConnectionResultStatusError,
} from "../../../../../../model/model";
import {CustomParams} from "../../../../../../component/custom-params/custom-params";

//=============================================================================

@Component({
  selector: 'system-login-dialog',
  templateUrl: 'system-login.dialog.html',
  styleUrls : ['system-login.dialog.scss'],
  imports: [MatDialogModule, MatButtonModule, MatTabsModule, CustomParams]
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

  systemCode    : string                = ""
  configValues  : {[index: string]:any} = {}
  connectParams : AdapterParam[]        = []
  connectValues : {[index: string]:any} = {}
  connectGlobals: {[index: string]:any} = {}

  @ViewChild("paramsCtrl") paramsCtrl? : CustomParams

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

    this.systemCode   = data.conn.systemCode
    this.configValues = JSON.parse(data.conn.systemConfigParams)

    this.systemAdapterService.getConnectionParams(this.systemCode, this.configValues).subscribe(params => {
      this.connectParams = params;
      this.loginDisabled = false
    })
  }

  //-------------------------------------------------------------------------
  //---
  //--- General methods
  //---
  //-------------------------------------------------------------------------

  onLogin() {
    this.connectGlobals = { ...this.connectGlobals, ...this.connectValues }

    let cr = new ConnectionRequest()
    cr.systemCode    = this.systemCode
    cr.configValues  = this.configValues
    cr.connectValues = this.connectGlobals

    this.loginDisabled = true
    this.loggingIn     = true
    this.error         = ""

    this.systemAdapterService.connect(this.data.conn.code, cr).subscribe( res => {
      //--- Connected

      if (res.status == ConnectionResultStatusConnected) {
        this.dialogRef.close(true)
      }

      //--- Got an error

      else if (res.status == ConnectionResultStatusError) {
        this.error         = res.message
        this.loginDisabled = false
        this.loggingIn     = false
      }

      //--- Adapter needs more params

      else if (res.status == ConnectionResultStatusConnecting) {
        this.loginDisabled = false
        this.loggingIn     = false

        if (res.url != "") {
          window.open(res.url, "_blank", "popup")
        }

        if (res.params.length != 0) {
          this.connectParams = res.params
          this.connectValues = {}
        }
        else {
          this.dialogRef.close(true)
        }
      }
    })
  }

  //-------------------------------------------------------------------------

  paramsAreValid() : boolean {
    if (this.paramsCtrl != undefined) {
      return this.paramsCtrl?.areParamsValid()
    }

    return false
  }
}

//=============================================================================
