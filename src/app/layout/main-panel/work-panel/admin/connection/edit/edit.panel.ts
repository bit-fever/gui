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
import {NgForOf, NgIf} from "@angular/common";
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
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";

//=============================================================================

@Component({
  selector    :     'connection-edit',
  templateUrl :   './edit.panel.html',
  styleUrls   : [ './edit.panel.scss' ],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, NgForOf, //NgModel,
    MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule,
    MatDividerModule, InputTextRequired, SelectRequired, MatCheckbox
  ],
  standalone  : true
})

//=============================================================================

export class ConnectionEditPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  conn = new ConnectionSpec()
  adapters : Adapter     [] = []
  params   : AdapterParam[] = []

  @ViewChild("connNameCtrl") connNameCtrl? : InputTextRequired

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
      let map = this.createMap(conn.systemConfig)
      this.params = this.updateParameters(adapter.params, map)
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

  onCheckChange(e : MatCheckboxChange, p : AdapterParam) {
    p.valueBool = e.checked
  }

  //-------------------------------------------------------------------------

  public label(code : string) : string {
    return this.labelService.getLabelString("adapter."+ this.conn.systemCode +"."+ code);
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.areAdapterParamsValid() && this.connNameCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    let conn = new ConnectionSpec()
    conn.id           = this.conn.id
    conn.code         = this.conn.code
    conn.name         = this.conn.name
    conn.systemCode   = this.conn.systemCode
    conn.systemConfig = this.createConfig()

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

  //-------------------------------------------------------------------------

  private areAdapterParamsValid() : boolean {
    let valid = true

    if (this.params != undefined) {
      this.params.forEach( p => {
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

  //-------------------------------------------------------------------------

  private createConfig() : string {
    let config = ""

    if (this.params != undefined) {
      let map : any = {}

      this.params.forEach( p => {
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

      config = JSON.stringify(map)
    }

    return config
  }

  //-------------------------------------------------------------------------

  private createMap(config : string ) : any {
    return JSON.parse(config)
  }

  //-------------------------------------------------------------------------

  private updateParameters(list : AdapterParam[], map : any) : AdapterParam[] {
    if (list == null) {
      return []
    }

    let newList : AdapterParam[] = []

    list.forEach(p => {
      newList = [ ...newList, p ]
      switch (p.type) {
        case "string":
        case "password":
          p.valueStr = map[p.name]
          break;
        case "int":
          p.valueInt = map[p.name]
          break;
        case "bool":
          p.valueBool = map[p.name]
          break;
      }
    })

    return newList
  }
}

//=============================================================================
