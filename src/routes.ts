//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Routes}             from "@angular/router";

import {Url}                from "./app/model/urls";
import {HomePanel}          from "./app/layout/main-panel/work-panel/home/home.panel";
import {
  PorTradingSystemPanel,
} from "./app/layout/main-panel/work-panel/portfolio/trading-system/trading-system.panel";
import {ConfigurationPanel} from "./app/layout/main-panel/work-panel/admin/configuration/configuration.panel";
import {UnknownPanel}       from "./app/layout/main-panel/work-panel/unknown/unknown.panel";
import {MonitoringPanel}    from "./app/layout/main-panel/work-panel/portfolio/monitoring/monitoring.panel";
import {FilteringPanel} from "./app/layout/main-panel/work-panel/portfolio/trading-system/filtering/filtering.panel";
import {ConnectionPanel} from "./app/layout/main-panel/work-panel/admin/connection/connection.panel";
import {ConnectionEditPanel} from "./app/layout/main-panel/work-panel/admin/connection/edit/edit.panel";
import {InvTradingSystemPanel} from "./app/layout/main-panel/work-panel/inventory/trading-system/trading-system.panel";
import {TradingSystemEditPanel} from "./app/layout/main-panel/work-panel/inventory/trading-system/edit/edit.panel";

//=============================================================================

export const routes: Routes = [
  { path:'',                                     redirectTo: Url.Home, pathMatch: 'full'    },

  { path: Url.Home,                               component: HomePanel                       },
  { path: Url.Inventory_TradingSystems,           component: InvTradingSystemPanel           },
  { path: Url.Right_TradingSystem_Edit,           component: TradingSystemEditPanel, outlet : 'right' },
  { path: Url.Portfolio_TradingSystems,           component: PorTradingSystemPanel           },

  { path: Url.Portfolio_TradingSystems_Id, children : [
      { path: Url.Sub_Filtering, component:  FilteringPanel }
  ]},

  { path: Url.Portfolio_Monitoring,               component: MonitoringPanel                 },
  { path: Url.Admin_Config,                       component: ConfigurationPanel              },
  { path: Url.Admin_Connections,                  component: ConnectionPanel                 },
  { path: Url.Right_Connection_Edit,              component: ConnectionEditPanel, outlet : 'right' },

  { path:'**',                     component: UnknownPanel },
];

//=============================================================================
