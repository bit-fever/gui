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
import {InvBrokerProductPanel} from "./app/layout/main-panel/work-panel/inventory/product-broker/product-broker.list";
import {ProductDataEditPanel} from "./app/layout/main-panel/work-panel/inventory/product-data/edit/product-data.edit";
import {
  ProductDataCreatePanel
} from "./app/layout/main-panel/work-panel/inventory/product-data/create/product-data.create";
import {
  BrokerProductCreatePanel
} from "./app/layout/main-panel/work-panel/inventory/product-broker/create/product-broker.create";
import {
  ProductBrokerEditPanel
} from "./app/layout/main-panel/work-panel/inventory/product-broker/edit/product-broker.edit";
import {
  InvDataProductViewPanel
} from "./app/layout/main-panel/work-panel/inventory/product-data/view/product-data.view";
import {
  DataInstrumentChartPanel
} from "./app/layout/main-panel/work-panel/inventory/product-data/view/chart/instrument-data.chart";
import {InvDataProductPanel} from "./app/layout/main-panel/work-panel/inventory/product-data/product-data.list";
import {BiasAnalisysListPanel} from "./app/layout/main-panel/work-panel/tool/bias-analysis/bias-analisys.list";
import {
  BiasAnalysisCreatePanel
} from "./app/layout/main-panel/work-panel/tool/bias-analysis/create/bias-analysis.create";
import {BiasAnalysisEditPanel} from "./app/layout/main-panel/work-panel/tool/bias-analysis/edit/bias-analysis.edit";
import { BiasAnalysisPlaygroundPanel
} from "./app/layout/main-panel/work-panel/tool/bias-analysis/playground/bias-analysis.playground";
import {
  DataInstrumentDataPanel
} from "./app/layout/main-panel/work-panel/inventory/product-data/view/data/instrument-data.data";
import {
  BiasAnalysisBacktestPanel
} from "./app/layout/main-panel/work-panel/tool/bias-analysis/backtest/bias-analysis.backtest";
import {ConnectionCreatePanel} from "./app/layout/main-panel/work-panel/admin/connection/create/create.panel";
import {
  TradingSystemDashboard
} from "./app/layout/main-panel/work-panel/portfolio/trading-system/trading-system.dashboard";

//=============================================================================

export const routes: Routes = [
  { path:'',                                     redirectTo: Url.Home, pathMatch: 'full'    },

  { path: Url.Home,                               component: HomePanel                       },

  //--- Inventory

  { path: Url.Inventory_DataProducts,             component: InvDataProductPanel      },
  { path: Url.Inventory_DataProducts_Id,          component: InvDataProductViewPanel  },
  { path: Url.Inventory_DataProducts_Id, children : [
      { path: Url.Sub_Chart, component:  DataInstrumentChartPanel }
  ]},

  { path: Url.Inventory_DataInstruments_Id, children : [
      { path: Url.Sub_Data, component:  DataInstrumentDataPanel }
    ]},

  { path: Url.Right_DataProduct_Create,           component: ProductDataCreatePanel,   outlet : 'right' },
  { path: Url.Right_DataProduct_Edit,             component: ProductDataEditPanel,     outlet : 'right' },
  { path: Url.Inventory_BrokerProducts,           component: InvBrokerProductPanel           },
  { path: Url.Right_BrokerProduct_Create,         component: BrokerProductCreatePanel, outlet : 'right' },
  { path: Url.Right_BrokerProduct_Edit,           component: ProductBrokerEditPanel,   outlet : 'right' },
  { path: Url.Inventory_TradingSystems,           component: InvTradingSystemPanel           },
  { path: Url.Right_TradingSystem_Edit,           component: TradingSystemEditPanel,   outlet : 'right' },

  //--- Portfolio

  { path: Url.Portfolio_TradingSystems,           component: PorTradingSystemPanel           },
  { path: Url.Portfolio_TradingSystemsDb,         component: TradingSystemDashboard          },

  { path: Url.Portfolio_TradingSystems_Id, children : [
      { path: Url.Sub_Filtering, component:  FilteringPanel }
  ]},

  { path: Url.Portfolio_Monitoring,               component: MonitoringPanel                 },

  //--- Tool

  { path: Url.Tool_BiasAnalyses,                  component: BiasAnalisysListPanel           },
  { path: Url.Right_BiasAnalysis_Create,          component: BiasAnalysisCreatePanel, outlet : 'right' },
  { path: Url.Right_BiasAnalysis_Edit,            component: BiasAnalysisEditPanel,   outlet : 'right' },
  { path: Url.Tool_BiasAnalyses_Id, children : [
      { path: Url.Sub_Playground, component:  BiasAnalysisPlaygroundPanel },
      { path: Url.Sub_Backtest,   component:  BiasAnalysisBacktestPanel   }
    ]},

  //--- Admin

  { path: Url.Admin_Config,                       component: ConfigurationPanel              },
  { path: Url.Admin_Connections,                  component: ConnectionPanel                 },
  { path: Url.Right_Connection_Create,            component: ConnectionCreatePanel, outlet : 'right' },
  { path: Url.Right_Connection_Edit,              component: ConnectionEditPanel,   outlet : 'right' },

  { path:'**',                                    component: UnknownPanel },
];

//=============================================================================
