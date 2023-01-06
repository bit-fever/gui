//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { NgModule }                from '@angular/core';
import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from "@angular/common/http";

//-----------------------------------------------------------------------------

import {MatToolbarModule}      from "@angular/material/toolbar";
import {MatSidenavModule}      from "@angular/material/sidenav";
import {MatIconModule}         from "@angular/material/icon";
import {MatButtonModule}       from "@angular/material/button";
import {MatCardModule}         from "@angular/material/card";
import {MatExpansionModule}    from '@angular/material/expansion';
import {MatListModule}         from '@angular/material/list';
import {MatInputModule}        from '@angular/material/input';
import {MatTableModule}        from "@angular/material/table";
import {MatPaginatorModule}    from "@angular/material/paginator";

//-----------------------------------------------------------------------------

import { AppRoutingModule }     from './app-routing.module';
import { AppComponent }         from './layout/app.component';
import { HeaderPanel }          from './layout/header-panel/header-panel';
import { MainPanel }            from './layout/main-panel/main.panel';
import { LeftPanel }            from './layout/main-panel/left-panel/left-panel';
import { WorkPanel }            from './layout/main-panel/work-panel/work.panel';
import { RightPanel }           from './layout/main-panel/right-panel/right-panel';
import { MarketInventoryPanel } from "./layout/main-panel/work-panel/market/inventory/inventory.panel";
import { UnknownPanel }         from "./layout/main-panel/work-panel/unknown/unknown.panel";
import { UserViewPanel }        from './layout/main-panel/right-panel/user/view/user-view';
import { ConfigurationPanel}    from './layout/main-panel/work-panel/admin/configuration/configuration.panel';

import { ApplicationService }   from "./service/application.service";
import { EventbusService }      from "./service/eventbus.service";
import { HttpService }          from "./service/http.service";
import { LabelService }         from "./service/label.service";
import { NotificationService }  from "./service/notification.service";
import { SessionService }       from "./service/session.service";
import { MenuService }          from "./service/menu.service";

import { SidebarMenuComponent } from "./component/sidebar-menu/sidebar-menu.component";
import { ItemComponent }        from "./component/sidebar-menu/component/item/item.component";
import { NodeComponent }        from "./component/sidebar-menu/component/node/node.component";
import { AnchorComponent }      from "./component/sidebar-menu/component/anchor/anchor.component";

//=============================================================================

@NgModule({
  declarations: [
    AppComponent,
    HeaderPanel,
    MainPanel,
    LeftPanel,
    WorkPanel,
    RightPanel,
    UnknownPanel,
    UserViewPanel,
    ConfigurationPanel,
    MarketInventoryPanel,

    SidebarMenuComponent, ItemComponent, NodeComponent, AnchorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    //--- Material
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule
  ],
  providers: [
    ApplicationService,
    EventbusService,
    HttpService,
    LabelService,
    MenuService,
    NotificationService,
    SessionService,

    // RoleService
  ],
  bootstrap: [
    AppComponent
  ]
})

//=============================================================================

export class AppModule {
}

//=============================================================================
