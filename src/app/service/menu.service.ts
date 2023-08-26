//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { Injectable }         from '@angular/core';
import { BehaviorSubject }    from 'rxjs';

import { AppEvent }           from "../model/event";
import { Roles }              from '../model/user/roles';
import { Menu }               from '../component/sidebar-menu/model';
import { AbstractSubscriber } from "./abstract-subscriber";
import { LabelService }       from "./label.service";
import { EventBusService }    from "./eventbus.service";

//=============================================================================

@Injectable()
export class MenuService extends AbstractSubscriber {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  private menu = new BehaviorSubject<Menu | undefined>(undefined);
  menu$ = this.menu.asObservable();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService   : LabelService, eventBusService: EventBusService) {
    super(eventBusService);
    super.subscribeToApp(AppEvent.LOCALIZATION_READY, (event : AppEvent) => this.setMenu());
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private setMenu(): void {
    const menu: Menu = [
      {
        id: 'menu.main',
        header: this.labelService.getLabel('menu', 'main'),
      },
      {
        id: 'menu.main.home',
        label: this.labelService.getLabel('menu', 'main.home'),
        route: '/home',
        iconClasses: 'home'
      },

      //-------------------------------------------------------------

      {
        id: 'menu.portfolio',
        header: this.labelService.getLabel('menu', 'portfolio'),
      },
      {
        id: 'menu.portfolio.trading-system',
        label: this.labelService.getLabel('menu', 'portfolio.trading-system'),
        route: '/portfolio/trading-system',
        iconClasses: 'inventory'
      },
      {
        id: 'menu.portfolio.monitoring',
        label: this.labelService.getLabel('menu', 'portfolio.monitoring'),
        route: '/portfolio/monitoring',
        iconClasses: 'monitor_heart'
      },

      //-------------------------------------------------------------

      {
        id: 'menu.admin',
        header: this.labelService.getLabel('menu', 'administration')
      },
      {
        id: 'menu.admin.config',
        label: this.labelService.getLabel('menu', 'admin.config'),
        route: '/admin/config',
        iconClasses: 'tune'
      },
      {
        id: 'menu.link',
        label: this.labelService.getLabel('menu', 'link'),
        iconClasses: 'http',
        url: '//github.com/bit-fever',
      },
    ];

    this.menu.next(menu);
  }
}

//=============================================================================
