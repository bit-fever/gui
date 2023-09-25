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
