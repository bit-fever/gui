//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class Portfolio {
  id?        : number;
  parentId?  : number;
  name?      : string;
  createdAt? : string;
  updatedAt? : string;
}

//=============================================================================

export class PortfolioTree extends Portfolio {
  children      : PortfolioTree[] = [];
  tradingSystems: TradingSystem[] = [];
}

//=============================================================================

export class Instrument {
  id?        : number;
  ticker?    : string;
  name?      : string;
  createdAt? : string;
  updatedAt? : string;
}

//=============================================================================

export class TradingSystem {
  id?             : number;
  code?           : string;
  name?           : string;
  instrumentId?   : number;
  portfolioId?    : number;
  firstUpdate?    : number;
  lastUpdate?     : number;
  lastPl?         : number;
  tradingDays?    : number;
  numTrades?      : number;
  filterType?     : number;
  filter?         : string;
  suggestedAction?: number;
  createdAt?      : string;
  updatedAt?      : string;
}

//=============================================================================

export class TradingSystemFull extends TradingSystem {
	instrumentTicker? : string;
	portfolioName?    : string;
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

