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
//===
//=== Filtering
//===
//=============================================================================

export class TradingFilters {
  equAvgEnabled  : boolean = false
  equAvgDays     : number  = 0

  posProEnabled  : boolean = false
  posProDays     : number  = 0

  winPerEnabled  : boolean = false
  winPerDays     : number  = 0
  winPerValue    : number  = 0

  oldNewEnabled  : boolean = false
  oldNewOldDays  : number  = 0
  oldNewOldPerc  : number  = 0
  oldNewNewDays  : number  = 0
}

//=============================================================================

export class FilterAnalysisRequest {
  filters? : TradingFilters

  constructor(filters? : TradingFilters) {
    this.filters = filters
  }
}

//=============================================================================

export class TradingSystemSmall {
  id   : number = 0
  name : string = ""
}

//-----------------------------------------------------------------------------

export class Summary {
  unfProfit       : number = 0
  filProfit       : number = 0
  unfMaxDrawdown  : number = 0
  filMaxDrawdown  : number = 0
  unfWinningPerc  : number = 0
  filWinningPerc  : number = 0
  unfAverageTrade : number = 0
  filAverageTrade : number = 0
}

//-----------------------------------------------------------------------------

export class Plot {
  days   : number[] = []
  values : number[] = []
}

//-----------------------------------------------------------------------------

export class Equities {
  days               : number[] = []
  unfilteredEquity   : number[] = []
  filteredEquity     : number[] = []
  unfilteredDrawdown : number[] = []
  filteredDrawdown   : number[] = []
  filterActivation   : number[] = []
  average            : Plot = new Plot()
}

//-----------------------------------------------------------------------------

export class Activations {
  equityVsAverage?   : Plot
  positiveProfit?    : Plot
  winningPercentage? : Plot
  oldVsNew?          : Plot
}

//-----------------------------------------------------------------------------

export class FilterAnalysisResponse {
  tradingSystem : TradingSystemSmall = new TradingSystemSmall()
  summary       : Summary            = new Summary()
  equities      : Equities           = new Equities()
  filters       : TradingFilters     = new TradingFilters()
  activations   : Activations        = new Activations()
}

//=============================================================================
