//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class Portfolio {
  id?        : number;
  name?      : string;
  createdAt? : string;
  updatedAt? : string;
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
