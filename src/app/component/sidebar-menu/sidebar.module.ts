//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {NgModule} from '@angular/core';

import {CommonModule}         from "@angular/common";
import {RouterModule}         from "@angular/router";
import {MatIconModule}        from "@angular/material/icon";
import {AnchorService}        from './service/anchor.service';
import {NodeService}          from './service/node.service';
import {RoleService}          from './service/role.service';
import {SearchService}        from './service/search.service';
import {ItemComponent}        from "./component/item/item.component";
import {SidebarMenuComponent} from "./sidebar-menu.component";
import {AnchorComponent}      from "./component/anchor/anchor.component";
import {NodeComponent}        from "./component/node/node.component";

//=============================================================================

@NgModule({
	declarations: [SidebarMenuComponent, AnchorComponent, ItemComponent, NodeComponent],
	exports     : [SidebarMenuComponent, AnchorComponent, ItemComponent, NodeComponent],
	imports     : [CommonModule, MatIconModule, RouterModule],
	providers   : [AnchorService, NodeService, RoleService, SearchService],
})

//=============================================================================

export class SidebarMenuModule {}

//=============================================================================
