//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {ChangeDetectionStrategy, Component, importProvidersFrom, Input} from '@angular/core';

import { Menu, SidebarModes, Role, UnAuthorizedVisibility } from './model';

import { AnchorService } from './service/anchor.service';
import { NodeService }   from './service/node.service';
import { RoleService }   from './service/role.service';
import { SearchService } from './service/search.service';
import { trackByItem }   from './internal/utils';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

//=============================================================================

@Component({
	selector       : 'asm-angular-sidebar-menu',
	templateUrl    : './sidebar-menu.component.html',
	styleUrls      : [ 'sidebar-menu.component.scss' ],
	providers      : [ NodeService, AnchorService, RoleService, SearchService ],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

//=============================================================================

export class SidebarMenuComponent {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() mode = SidebarModes.EXPANDED;

  menu?: Menu;
  modes             = SidebarModes;
  disableAnimations = true;
  trackByItem       = trackByItem;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(
    private anchorService: AnchorService,
    private nodeService  : NodeService,
    private searchService: SearchService,
    public  roleService  : RoleService
  ) {}

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  @Input('menu') set _menu(menu: Menu) {
    this.disableAnimations = true;
    this.menu = menu;

    setTimeout(() => {
      this.disableAnimations = false;
    });
  }

  //-------------------------------------------------------------------------

  @Input() set iconClasses(cssClasses: string) {
    this.anchorService.iconClasses = cssClasses;
  }

  //-------------------------------------------------------------------------

  @Input() set toggleIconClasses(cssClasses: string) {
    this.nodeService.toggleIconClasses = cssClasses;
  }

  //-------------------------------------------------------------------------

  @Input() set role(role: Role | undefined) {
    this.roleService.role = role;
  }

  //-------------------------------------------------------------------------

  @Input() set unAuthorizedVisibility(visibility: UnAuthorizedVisibility) {
    this.roleService.unAuthorizedVisibility = visibility;
  }

  //-------------------------------------------------------------------------

  @Input() set search(value: string | undefined) {
    this.searchService.search = value;
  }
}

//=============================================================================
