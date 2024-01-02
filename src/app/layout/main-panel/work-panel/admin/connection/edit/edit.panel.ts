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
import {Adapter, ConnectionSpec} from "../../../../../../model/model";
import {SelectTextRequired} from "../../../../../../component/form/select-required/select-text-required";
import {InventoryService} from "../../../../../../service/inventory.service";

//=============================================================================

@Component({
  selector    :     'connection-edit',
  templateUrl :   './edit.panel.html',
  styleUrls   : [ './edit.panel.scss' ],
  imports: [RightTitlePanel, MatFormFieldModule, MatOptionModule, MatSelectModule, NgForOf, //NgModel,
            MatInputModule, MatIconModule, MatButtonModule, NgIf, FormsModule, ReactiveFormsModule,
            MatDividerModule, InputTextRequired, SelectTextRequired
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
  adapters : Adapter[] = []

  @ViewChild("connCodeCtrl")       connCodeCtrl?       : InputTextRequired
  @ViewChild("connNameCtrl")       connNameCtrl?       : InputTextRequired
  @ViewChild("connSystemCodeCtrl") connSystemCodeCtrl? : SelectTextRequired

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
  //---
  //--- Template methods
  //---
  //-------------------------------------------------------------------------

  // get userStatus() {
  // 	return this.labelService.getMapping("userStatus");
  // }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  private onStart(event : AppEvent) : void {
  	console.log("ConnectionEditPanel: Starting...");

    this.conn = new ConnectionSpec()

  	// let rse : RowSelectedEvent = event.params;
  	// this.user = rse.row;
  }

  //-------------------------------------------------------------------------

  public saveEnabled() : boolean|undefined {
    return  this.connCodeCtrl?.isValid() &&
            this.connNameCtrl?.isValid() &&
            this.connSystemCodeCtrl?.isValid()
  }

  //-------------------------------------------------------------------------

  public onSave() : void {

  	console.log("Connection is : \n"+ JSON.stringify(this.conn));

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
}

//=============================================================================
