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
    selector: 'connection-create',
    templateUrl: './create.panel.html',
    styleUrls: ['./create.panel.scss'],
    imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, NgForOf, //NgModel,
        MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule,
        MatDividerModule, InputTextRequired, SelectRequired, MatCheckbox
    ]
})

//=============================================================================

export class ConnectionCreatePanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  conn = new ConnectionSpec()
  adapters : Adapter     [] = []
  params   : AdapterParam[] = []

  @ViewChild("connCodeCtrl")       connCodeCtrl?       : InputTextRequired
  @ViewChild("connNameCtrl")       connNameCtrl?       : InputTextRequired
  @ViewChild("connSystemCodeCtrl") connSystemCodeCtrl? : SelectRequired

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
  	super.subscribeToApp(AppEvent.CONNECTION_CREATE_START, (e : AppEvent) => this.onStart(e));

	  systemAdapterService.getAdapters().subscribe(
		  result => {
			  this.adapters = result.result;
		})
  }

  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
  	console.log("ConnectionCreatePanel: Starting...");
    this.conn   = new ConnectionSpec()
    this.params = []
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onAdapterChange(e : string) {
    console.log("Adapter change : "+ e)

    this.adapters.forEach( a => {
      if (a.code == e) {
        this.params = this.initParameters(a.params)
      }
    })
  }

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
    return  this.areAdapterParamsValid() &&
            this.connCodeCtrl?.isValid() &&
            this.connNameCtrl?.isValid() &&
            this.connSystemCodeCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {
    this.conn.systemConfig = this.createConfig()

    this.inventoryService.addConnection(this.conn).subscribe( c => {
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

  private initParameters(list : AdapterParam[]) : AdapterParam[] {
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
}

//=============================================================================
