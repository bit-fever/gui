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
import {Url} from "../model/urls";

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
        header: this.get('main._label'),
      },
      {
        id: 'menu.main.home',
        label: this.get('main.home'),
        route: Url.Home,
        iconClasses: 'home'
      },

      //-------------------------------------------------------------

      {
        id: 'menu.inventory',
        header: this.get('inventory._label'),
      },
      {
        id: 'menu.inventory.data-product',
        label: this.get('inventory.dataProduct'),
        route: Url.Inventory_DataProducts,
        iconClasses: 'dataset'
      },
      {
        id: 'menu.inventory.broker-product',
        label: this.get('inventory.brokerProduct'),
        route: Url.Inventory_BrokerProducts,
        iconClasses: 'currency_exchange'
      },
      {
        id: 'menu.inventory.trading-system',
        label: this.get('inventory.tradingSystem'),
        route: Url.Inventory_TradingSystems,
        iconClasses: 'inventory'
      },

      //-------------------------------------------------------------

      {
        id: 'menu.portfolio',
        header: this.get('portfolio._label'),
      },
      {
        id: 'menu.portfolio.trading-system',
        label: this.get('portfolio.tradingSystem'),
        route: Url.Portfolio_TradingSystems,
        iconClasses: 'inventory'
      },
      {
        id: 'menu.portfolio.monitoring',
        label: this.get('portfolio.monitoring'),
        route: Url.Portfolio_Monitoring,
        iconClasses: 'monitor_heart'
      },

      //-------------------------------------------------------------

      {
        id: 'menu.tool',
        header: this.get('tool._label')
      },
      {
        id: 'menu.tool.bias-analyzer',
        label: this.get('tool.biasAnalyzer'),
        route: Url.Tool_BiasAnalyzer,
        iconClasses: 'query_stats'
      },

      //-------------------------------------------------------------

      {
        id: 'menu.admin',
        header: this.get('admin._label')
      },
      {
        id: 'menu.admin.connections',
        label: this.get('admin.connections'),
        route: Url.Admin_Connections,
        iconClasses: 'cable'
      },
      {
        id: 'menu.admin.config',
        label: this.get('admin.config'),
        route: Url.Admin_Config,
        iconClasses: 'tune'
      },
      {
        id: 'menu.link',
        label: this.get('admin.link'),
        iconClasses: 'http',
        url: '//github.com/bit-fever',
      },
    ];

    this.menu.next(menu);
  }

	//-------------------------------------------------------------------------

	private get(code : string) : string {
	  return this.labelService.getLabelString("menu."+ code);
	}
}

//=============================================================================
