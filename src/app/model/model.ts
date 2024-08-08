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

import _default from "chart.js/dist/plugins/plugin.tooltip";

//-----------------------------------------------------------------------------

export class StatusResponse {
  status? : string
}

//=============================================================================

export class Currency {
  id?       : number;
  code?     : string;
  name?     : string;
}

//=============================================================================

export class Exchange {
  id?        : number;
  currencyId?:number;
  code?      : string;
  name?      : string;
  timezone?  : string;
  url?       : string;
}

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
  productDataId?    : number
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
  supportsData?          : boolean
  supportsBroker?        : boolean
  supportsMultipleFeeds? : boolean
  supportsInventory?     : boolean
  createdAt?             : string
  updatedAt?             : string
}

//=============================================================================

export class ProductDataSpec {
  id?           : number
  connectionId? : number
  exchangeId?   : number
  symbol?       : string
  name?         : string
  increment?    : number
  marketType?   : string
  productType?  : string
}

//=============================================================================

export class ProductData extends ProductDataSpec {
  username?       : string
  createdAt?      : string
  updatedAt?      : string
}

//=============================================================================

export class InstrumentData {
  id?            : number
  productDataId? : number
  symbol?        : string
  name?          : string
  expirationDate?: string
  isContinuous?  : boolean
  dataFrom?      :number
  dataTo?        :number
}

//=============================================================================

export class ProductDataExt extends ProductData {
  connection? : Connection
  exchange?   : Exchange
}

//=============================================================================

export class ProductBrokerSpec {
  id?           : number
  connectionId? : number
  exchangeId?   : number
  symbol?       : string
  name?         : string
  pointValue?   : number
  costPerTrade? : number
  marginValue?  : number
  marketType?   : string
  productType?  : string
}

//=============================================================================

export class ProductBroker extends ProductBrokerSpec {
  username?     : string
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
//===
//=== FilterOptimizationRequest
//===
//=============================================================================

export class FieldOptimization {
  enabled : boolean
  curValue:number
  minValue: number
  maxValue: number
  step    : number

  //-----------------------------------------------------------------------------

  constructor(enabled : boolean, curValue:number, minValue : number, maxValue : number, step:number) {
    this.enabled = enabled
    this.curValue= curValue
    this.minValue= minValue
    this.maxValue= maxValue
    this.step    = step
  }

  //-----------------------------------------------------------------------------

  public toggle() {
    this.enabled = !this.enabled
  }
}

//=============================================================================

export class FilterOptimizationRequest {
  fieldToOptimize : string  = "net-profit"
  enablePosProfit : boolean = true
  enableOldNew    : boolean = true
  enableWinPerc   : boolean = true
  enableEquAvg    : boolean = true

  posProDays    : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 2)
  oldNewOldDays : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 2)
  oldNewNewDays : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 2)
  oldNewOldPerc : FieldOptimization = new FieldOptimization(true, 90, 5, 150, 5)
  winPercDays   : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 2)
  winPercPerc   : FieldOptimization = new FieldOptimization(true, 50, 5, 100, 5)
  equAvgDays    : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 2)
}

//=============================================================================
//===
//=== FilterOptimizationProgress
//===
//=============================================================================

export class FilterOptimizationResponse {
  currStep?        : number
  maxSteps?        : number
  startTime?       : string
  endTime?         : string
  status?          : string
  runs?            : FilterRun[]
  baseValue?       : number
  bestValue?       : number
  fieldToOptimize? : string
  duration?        : number
  filters?         : SelectedFilters
}

//=============================================================================

export class FilterRun {
  filterType  : string = ""
  days        : number = 0
  newDays     : number = 0
  percentage  : number = 0
  netProfit   : number = 0
  avgTrade    : number = 0
  maxDrawdown : number = 0
}

//=============================================================================

export class SelectedFilters {
  posProfit? : boolean
  oldVsNew?  : boolean
  winPerc?   : boolean
  equVsAvg?  : boolean
}

//=============================================================================
//===
//=== File upload
//===
//=============================================================================

export class DatafileUploadSpec {
  symbol?       : string
  name?         : string
  continuous?   : boolean
  fileTimezone? : string
  parser?       : string
}

//=============================================================================

export class DatafileUploadResponse {
  duration? : number
  bytes?    : number
}

//=============================================================================

export type ParserMap = {
  [key: string]: string
}

//=============================================================================
//===
//=== Data
//===
//=============================================================================

export class DataPoint {
  time   : string = ""
  open   : number = 0
  high   : number = 0
  low    : number = 0
  close  : number = 0
  volume : number = 0
}

//=============================================================================

export class InstrumentDataResponse {
  id          : number      = 0
  symbol      : string      = ""
  from        : string      = ""
  to          : string      = ""
  timeframe   : string      = ""
  timezone    : string      = ""
  reduction   : number      = 0
  reduced     : boolean     = false
  records     : number      = 0
  dataPoints  : DataPoint[] = []
}

//=============================================================================

// export class LinePoint {
//   x : Date
//   y : number
//
//   constructor(time : string, value : number) {
//     let tokens = time.substring(0, 10).split("-")
//     let y = tokens[0]
//     let m = tokens[1]
//     let d = tokens[2]
//
//     this.x = new Date(y,m,d)
//     this.y = value
//   }
// }

//=============================================================================
