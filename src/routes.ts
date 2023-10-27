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
import {TradingSystemPanel} from "./app/layout/main-panel/work-panel/portfolio/trading-system/trading-system.panel";
import {ConfigurationPanel} from "./app/layout/main-panel/work-panel/admin/configuration/configuration.panel";
import {UnknownPanel}       from "./app/layout/main-panel/work-panel/unknown/unknown.panel";
import {MonitoringPanel}    from "./app/layout/main-panel/work-panel/portfolio/monitoring/monitoring.panel";
import {FilteringPanel} from "./app/layout/main-panel/work-panel/portfolio/trading-system/filtering/filtering.panel";

//=============================================================================

export const routes: Routes = [
  { path:'',                                     redirectTo: Url.Home, pathMatch: 'full'    },

  { path: Url.Home,                               component: HomePanel                       },
  { path: Url.Portfolio_TradingSystems,           component: TradingSystemPanel              },

  { path: Url.Portfolio_TradingSystems_Id, children : [
      { path: Url.Filtering, component:  FilteringPanel }
  ]},

  { path: Url.Portfolio_Monitoring,               component: MonitoringPanel                 },
  { path: Url.Admin_Config,                       component: ConfigurationPanel              },
  // { path:'user-view',              component: UserViewPanel, outlet : 'right' },

  { path:'**',                     component: UnknownPanel },
];

//=============================================================================
