//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

//=============================================================================
//===
//=== Inventory
//===
//=============================================================================

export class Portfolio {
  id?        : number;
  username?  : string;
  parentId?  : number;
  name?      : string;
  createdAt? : string;
  updatedAt? : string;
}

//=============================================================================

export class TradingSession {
  id?        : number;
  username?  : string;
  name?      : string;
  config?    : string;
  createdAt? : string;
  updatedAt? : string;
}

//=============================================================================

export class PortfolioTree extends Portfolio {
  children      : PortfolioTree   [] = [];
  tradingSystems: InvTradingSystem[] = [];
}

//=============================================================================

export class TradingSystemSpec {
  id?               : number
  name?             : string
  portfolioId?      : number
  productFeedId?    : number
  productBrokerId?  : number
  tradingSessionId? : number
  workspaceCode?    : string
}

//=============================================================================

export class InvTradingSystem extends TradingSystemSpec {
  username?         : string;
  createdAt?        : string;
  updatedAt?        : string;
}

//=============================================================================

export class InvTradingSystemFull extends InvTradingSystem {
	instrumentTicker? : string;
	portfolioName?    : string;
}

//=============================================================================

export class ConnectionSpec {
  code?         : string
  name?         : string
  systemCode?   : string
  systemConfig? : string
}

//=============================================================================

export class Connection extends ConnectionSpec {
  id?                    : number
  username?              : string
  systemName?            : string
  connectionCode?        : string
  supportsFeed?          : boolean
  supportsBroker?        : boolean
  supportsMultipleFeeds? : boolean
  supportsInventory?     : boolean
  createdAt?             : string
  updatedAt?             : string
}

//=============================================================================

export class ProductFeed {
  id?             : number
  connectionId?   : number
  username?       : string
  symbol?         : string
  name?           : string
  priceScale?     : number
  minMovement?    : number
  marketType?     : string
  productType?    : string
  exchange?       : string
  createdAt?      : string
  updatedAt?      : string
}

//=============================================================================

export class ProductBroker {
  id?           : number
  connectionId? : number
  username?     : string
  symbol?       : string
  name?         : string
  pointValue?   : number
  costPerTrade? : number
  marginValue?  : number
  currencyId?   : number
  marketType?   : string
  productType?  : string
  exchange?     : string
  createdAt?    : string
  updatedAt?    : string
}

//=============================================================================
//===
//=== Portfolio
//===
//=============================================================================

export class PorTradingSystem {
  id?              : number;
  sourceId?        : number;
  username?        : string;
  workspaceCode?   : string;
  name?            : string;
  status?          : string;
  firstUpdate?     : number;
  lastUpdate?      : number;
  closedProfit?    : number;
  tradingDays?     : number;
  numTrades?       : number;
  productBrokerId? : number;
  brokerSymbol?    : string;
  pointValue?      : number;
  costPerTrade?    : number;
  marginValue?     : number;
  currencyId?      : number;
  currencyCode?    : string;
}

//=============================================================================
//===
//=== System adapter
//===
//=============================================================================

export class AdapterParam {
  name?      : string
  type?      : string
  label?     : string
  nullable?  : boolean
  minValue?  : number
  maxValue?  : number
  tooltip?   : string
  groupName? : string
}

//=============================================================================

export class Adapter {
  code?                  : string
  name?                  : string
  params?                : AdapterParam[]
  supportsFeed?          : boolean
  supportsBroker?        : boolean
  supportsMultipleFeeds? : boolean
  supportsInventory?     : boolean
}

//=============================================================================







//=============================================================================

class BaseMonitoring {
  days       : number[] = [];
  rawProfit  : number[] = [];
  netProfit  : number[] = [];
  rawDrawdown: number[] = [];
  netDrawdown: number[] = [];
  numTrades  : number[] = [];
}

//-----------------------------------------------------------------------------

export class TradingSystemMonitoring extends BaseMonitoring {
  id  : number = 0;
  name: string = '';
}

//-----------------------------------------------------------------------------

export class PortfolioMonitoringResponse extends BaseMonitoring {
  tradingSystems : TradingSystemMonitoring[] = [];
}

//=============================================================================

export class LongShort {
  enabled      : boolean = false
  longPeriod   : number  = 36
  shortPeriod  : number  = 8
  threshold    : number  = 1.2
  shortPosPerc : number  = 50
}

//-----------------------------------------------------------------------------

export class EquityAverage {
  enabled : boolean = false
  days    : number  = 30
}

//-----------------------------------------------------------------------------

export class FilteringConfig {
  longShort     : LongShort     = new LongShort()
  equityAverage : EquityAverage = new EquityAverage()
}

//-------------------------------------------------------------------------

export class FilteringParams {
  noConfig : boolean         = true
  config   : FilteringConfig = new FilteringConfig()
}

//=============================================================================

export class TradingSystemSmall {
  id   : number = 0
  name : string = ""
}

//-----------------------------------------------------------------------------

export class Summary {
  unfilteredProfit : number = 0
  filteredProfit   : number = 0
  unfilteredMaxDD  : number = 0
  filteredMaxDD    : number = 0
}

//-----------------------------------------------------------------------------

export class Equities {
  days               : number[] = []
  unfilteredProfit   : number[] = []
  filteredProfit     : number[] = []
  unfilteredDrawdown : number[] = []
  filteredDrawdown   : number[] = []
  average            : number[] = []
}

//-----------------------------------------------------------------------------

export class FilteringResponse {
  tradingSystem : TradingSystemSmall = new TradingSystemSmall()
  summary       : Summary            = new Summary()
  equities      : Equities           = new Equities()
  config        : FilteringConfig    = new FilteringConfig();
}

//=============================================================================
