//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class Portfolio {
  id             : number|null = null;
  name           : string|null = null;
  createdAt      : string|null = null;
  updatedAt      : string|null = null;
}

//=============================================================================

export class Instrument {
  id             : number|null = null;
  ticker         : string|null = null;
  name           : string|null = null;
  createdAt      : string|null = null;
  updatedAt      : string|null = null;
}

//=============================================================================

export class TradingSystem {
  id             : number|null = null;
  code           : string|null = null;
  name           : string|null = null;
  instrumentId   : number|null = null;
  portfolioId    : number|null = null;
  firstUpdate    : number|null = null;
  lastUpdate     : number|null = null;
  lastPl         : number|null = null;
  tradingDays    : number|null = null;
  numTrades      : number|null = null;
  filterType     : number|null = null;
  filter         : string|null = null;
  suggestedAction: number|null = null;
  createdAt      : string|null = null;
  updatedAt      : string|null = null;
}

//=============================================================================
