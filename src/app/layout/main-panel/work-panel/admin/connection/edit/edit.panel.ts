//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {RightTitlePanel} from "../../../../../../component/panel/right-title/right-title.panel";
import {AbstractPanel}   from "../../../../../../component/abstract.panel";
import {AppEvent} from "../../../../../../model/event";
import {LabelService} from "../../../../../../service/label.service";
import {EventBusService} from "../../../../../../service/eventbus.service";
import {Router} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {InputTextRequired} from "../../../../../../component/form/input-text-required/input-text-required";
import {SystemAdapterService} from "../../../../../../service/system-adapter.service";
import {Adapter, AdapterParam, Connection, ConnectionSpec} from "../../../../../../model/model";
import {SelectRequired} from "../../../../../../component/form/select-required/select-required";
import {InventoryService} from "../../../../../../service/inventory.service";
import {CustomParams} from "../../../../../../component/custom-params/custom-params";

//=============================================================================

@Component({
    selector: 'connection-edit',
    templateUrl: './edit.panel.html',
    styleUrls: ['./edit.panel.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule,
        MatInputModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule,
        MatDividerModule, InputTextRequired, SelectRequired, CustomParams
    ]
})

//=============================================================================

export class ConnectionEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  conn = new ConnectionSpec()
  adapters : Adapter     []  = []
  params   : AdapterParam[]  = []
  values   : {[index: string]:any} = {}

  @ViewChild("connNameCtrl") connNameCtrl? : InputTextRequired
  @ViewChild("paramsCtrl")   paramsCtrl?   : CustomParams

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService          : EventBusService,
              labelService             : LabelService,
              router                   : Router,
              systemAdapterService     : SystemAdapterService,
              private inventoryService : InventoryService) {

  	super(eventBusService, labelService, router, "admin.connection");
  	super.subscribeToApp(AppEvent.CONNECTION_EDIT_START, (e : AppEvent) => this.onStart(e));

	  systemAdapterService.getAdapters().subscribe(
		  result => {
			  this.adapters = result.result;
		})
  }

  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
  	console.log("ConnectionEditPanel: Starting...");

  	let conn : Connection = event.params;
    this.conn = Object.assign(new Connection(), conn)

    let adapter = this.findAdapter(conn.systemCode)
    if (adapter != undefined) {
      this.params = adapter.configParams
      this.values = JSON.parse(conn.systemConfigParams)
      console.log("Connection parameters have been initialized")
    }
    else {
      console.log("Adapter not found !!!!!! --> "+ conn.systemCode)
    }
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return this.paramsCtrl?.areParamsValid() && this.connNameCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    let conn = new ConnectionSpec()
    conn.id                 = this.conn.id
    conn.code               = this.conn.code
    conn.name               = this.conn.name
    conn.systemCode         = this.conn.systemCode
    conn.systemConfigParams = JSON.stringify(this.values)

    this.inventoryService.updateConnection(conn).subscribe( c => {
      this.onClose();
      this.emitToApp(new AppEvent<any>(AppEvent.CONNECTION_LIST_RELOAD))
    })
  }

  //-------------------------------------------------------------------------

  public onClose() : void {
  	let event = new AppEvent(AppEvent.RIGHT_PANEL_CLOSE);
  	super.emitToApp(event);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private findAdapter(code : string) : Adapter|undefined {
    let adapter = undefined

    this.adapters.forEach( a => {
      if (a.code == code) {
        adapter = a
      }
    })

    return adapter
  }
}

//=============================================================================
