//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ViewChild} from '@angular/core';
import {CommonModule}         from "@angular/common";
import {MatInputModule}       from "@angular/material/input";
import {MatCardModule}        from "@angular/material/card";
import {MatIconModule}        from "@angular/material/icon";
import {MatButtonModule}      from "@angular/material/button";
import {AdapterParam, Connection, ConnectionRequest, ConnectionResultStatusOpenUrl} from "../../../../../model/model";
import {FlexTableColumn, ListService} from "../../../../../model/flex-table";
import {AbstractPanel}        from "../../../../../component/abstract.panel";
import {FlexTablePanel}       from "../../../../../component/panel/flex-table/flex-table.panel";
import {LabelService}         from "../../../../../service/label.service";
import {EventBusService}      from "../../../../../service/eventbus.service";
import {
  ConnectionStyler, IsoDateTranscoder,
} from "../../../../../component/panel/flex-table/transcoders";
import {Router, RouterModule} from "@angular/router";
import {Url} from "../../../../../model/urls";
import {AppEvent} from "../../../../../model/event";
import {InventoryService} from "../../../../../service/inventory.service";
import {SystemAdapterService} from "../../../../../service/system-adapter.service";

//=============================================================================

@Component({
  selector    :     'connection',
  templateUrl :   './connection.panel.html',
  styleUrls   : [ './connection.panel.scss' ],
  imports     : [ CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatInputModule,
                  RouterModule, FlexTablePanel],
  standalone  : true
})

//=============================================================================

export class ConnectionPanel extends AbstractPanel {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  columns   : FlexTableColumn[] = [];
  service   : ListService<Connection>;
  disCreate : boolean = false;
  disView   : boolean = true
  disEdit   : boolean = true
  disConnect: boolean = true
  disDisconn: boolean = true

  @ViewChild("table") table : FlexTablePanel<Connection>|null = null;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(eventBusService : EventBusService,
              labelService    : LabelService,
              router          : Router,
              inventoryService: InventoryService,
              private systemAdapterService: SystemAdapterService) {

    super(eventBusService, labelService, router, "admin.connection");
    this.service = inventoryService.getConnections;
    eventBusService.subscribeToApp(AppEvent.CONNECTION_LIST_RELOAD, () => {
      this.table?.reload()
      this.updateButtons([])
    })
  }

  //-------------------------------------------------------------------------

  override init = () : void => {
    this.setupColumns();
  }

  //-------------------------------------------------------------------------
  //---
  //--- Events
  //---
  //-------------------------------------------------------------------------

  onRowSelected(selection : Connection[]) {
    this.updateButtons(selection);
  }

  //-------------------------------------------------------------------------

  onCreateClick() {
    this.openRightPanel(Url.Admin_Connections, Url.Right_Connection_Create, AppEvent.CONNECTION_CREATE_START);
  }

  //-------------------------------------------------------------------------

  onViewClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      console.log(JSON.stringify(selection))
    }
  }

  //-------------------------------------------------------------------------

  onEditClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      this.openRightPanel(Url.Admin_Connections, Url.Right_Connection_Edit, AppEvent.CONNECTION_EDIT_START, selection[0]);
    }
  }

  //-------------------------------------------------------------------------

  onConnectClick() {
    // @ts-ignore
    let selection = this.table.getSelection();

    if (selection.length > 0) {
      let conn = selection[0]
      let cr = new ConnectionRequest()
      cr.systemCode = conn.systemCode
      cr.config     = JSON.parse(conn.systemConfig)

      this.systemAdapterService.connect(cr).subscribe( res => {
        console.log("Connection result: "+ JSON.stringify(res))
        if (res.status == ConnectionResultStatusOpenUrl) {
          window.open(res.message, "_blank", "popup")
        }
      })
    }
  }

  //-------------------------------------------------------------------------

  onDisconnectClick() {

  }

  //-------------------------------------------------------------------------
  //---
  //--- Init methods
  //---
  //-------------------------------------------------------------------------

  setupColumns = () => {
    let ts = this.labelService.getLabel("model.connection");

    this.columns = [
      new FlexTableColumn(ts, "username"),
      new FlexTableColumn(ts, "code"),
      new FlexTableColumn(ts, "name"),
      new FlexTableColumn(ts, "systemCode"),
      new FlexTableColumn(ts, "systemName"),
      new FlexTableColumn(ts, "connectionCode", undefined, new ConnectionStyler()),
      new FlexTableColumn(ts, "updatedAt", new IsoDateTranscoder()),
    ]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private updateButtons = (selection : Connection[]) => {
    this.disView    = (selection.length != 1)
    this.disEdit    = this.disView
    this.disConnect = this.disView
    this.disDisconn = this.disView

    if ( selection.length == 1) {
      let conn = selection[0]
      let isConnected = (conn.instanceCode != "")
      this.disEdit    = isConnected
      this.disConnect = isConnected
      this.disDisconn = !isConnected
    }
  }
}

//=============================================================================
