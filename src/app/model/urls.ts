//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export enum Url {
  Home                        = "home",
  Inventory_ProductData       = "inventory/product-data",
  Inventory_ProductData_Id    = "inventory/product-data/:id",
  Inventory_ProductBroker     = "inventory/product-broker",
  Inventory_TradingSystems    = "inventory/trading-systems",

  Portfolio_TradingSystems    = "portfolio/trading-systems",
  Portfolio_TradingSystems_Id = "portfolio/trading-systems/:id",
  Portfolio_Monitoring        = "portfolio/monitoring",
  Admin_Connections           = "admin/connections",
  Admin_Config                = "admin/config",

  Sub_Filtering = "filtering",

  Right_Connection_Edit     = "connection-edit",
  Right_TradingSystem_Edit  = "tradingSystem-edit",
  Right_ProductData_Create  = "productData-create",
  Right_ProductData_Edit    = "productData-edit",
  Right_ProductBroker_Create= "productBroker-create",
  Right_ProductBroker_Edit  = "productBroker-edit"
}

//=============================================================================
