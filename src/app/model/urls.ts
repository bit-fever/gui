//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export enum Url {
  Home                        = "home",
  Inventory_DataProducts      = "inventory/data-products",
  Inventory_DataProducts_Id   = "inventory/data-products/:id",
  Inventory_BrokerProducts    = "inventory/broker-products",
  Inventory_TradingSystems    = "inventory/trading-systems",

  Portfolio_TradingSystems    = "portfolio/trading-systems",
  Portfolio_TradingSystems_Id = "portfolio/trading-systems/:id",
  Portfolio_Monitoring        = "portfolio/monitoring",

  Tool_BiasAnalyses           = "tool/bias-analyses",
  Tool_BiasAnalyses_Id        = "tool/bias-analyses/:id",

  Admin_Connections           = "admin/connections",
  Admin_Config                = "admin/config",

  Sub_Filtering = "filtering",
  Sub_Chart     = "chart",
  Sub_Summary   = "summary",

  Right_Connection_Edit     = "connection-edit",
  Right_TradingSystem_Edit  = "tradingSystem-edit",
  Right_DataProduct_Create  = "dataProduct-create",
  Right_DataProduct_Edit    = "dataProduct-edit",
  Right_BrokerProduct_Create= "brokerProduct-create",
  Right_BrokerProduct_Edit  = "brokerProduct-edit",
  Right_BiasAnalysis_Create = "biasAnalysis-create",
  Right_BiasAnalysis_Edit   = "biasAnalysis-edit",
}

//=============================================================================
