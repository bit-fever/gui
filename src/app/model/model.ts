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

import {TreeNodeProvider} from "./flex-tree";

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

export class PortfolioTree extends Portfolio {
  children      : PortfolioTree   [] = [];
  tradingSystems: InvTradingSystem[] = [];
}

//=============================================================================

export class TradingSystemSpec {
  id?               : number
  name?             : string
  portfolioId?      : number
  dataProductId?    : number
  brokerProductId?  : number
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
  id?          : number
  code         : string = ""
  name         : string = ""
  systemCode   : string = ""
  systemConfig : string = ""
}

//=============================================================================

export class Connection extends ConnectionSpec {
  username?              : string
  systemName?            : string
  instanceCode?          : string
  supportsData?          : boolean
  supportsBroker?        : boolean
  supportsMultipleFeeds? : boolean
  supportsInventory?     : boolean
  createdAt?             : string
  updatedAt?             : string
}

//=============================================================================

export class ConnectionRequest {
  systemCode? : string
  config      : any
}

//=============================================================================

export const ConnectionResultStatusOpenUrl = "open-url"

export class ConnectionResult {
  instanceCode : string = ""
  status       : string = ""
  message      : string = ""
}

//=============================================================================

export class DataProductSpec {
  id?           : number
  connectionId? : number
  exchangeId?   : number
  symbol?       : string
  name?         : string
  marketType?   : string
  productType?  : string
}

//=============================================================================

export class DataProduct extends DataProductSpec {
  username?       : string
  createdAt?      : string
  updatedAt?      : string
}

//=============================================================================

export class DataInstrument {
  id?            : number
  dataProductId? : number
  symbol?        : string
  name?          : string
  expirationDate?: string
  isContinuous?  : boolean
  dataFrom?      :number
  dataTo?        :number
}

//=============================================================================

export class DataInstrumentExt extends DataInstrument {
}

//=============================================================================

export class DataInstrumentFull extends DataInstrument {
  productSymbol?  : string
  systemCode?     : string
  connectionCode? : string
}

//=============================================================================

export class DataProductExt extends DataProduct {
  connection? : Connection
  exchange?   : Exchange
}

//=============================================================================

export class BrokerProductSpec {
  id?               : number
  connectionId?     : number
  exchangeId?       : number
  symbol?           : string
  name?             : string
  pointValue?       : number
  costPerOperation? : number
  marginValue?      : number
  increment?        : number
  marketType?       : string
  productType?      : string
}

//=============================================================================

export class BrokerProduct extends BrokerProductSpec {
  username?       : string
  createdAt?      : string
  updatedAt?      : string
  connectionCode? : string
  exchangeCode?   : string
  currencyCode?   : string
}

//=============================================================================
//===
//=== Portfolio
//===
//=============================================================================

export enum TsActivation {
  Manual, Auto
}

//-----------------------------------------------------------------------------

export enum TsStatus {
  Off, Paused, Running, Idle, Broken
}

//-----------------------------------------------------------------------------

export class PorTradingSystem {
  id?              : number
  username?        : string
  workspaceCode?   : string
  name?            : string
  firstTrade?      : string
  lastTrade?       : string
  lmNetProfit?     : number
  lmNetAvgTrade?   : number
  lmNumTrades?     : number
  brokerProductId? : number
  brokerSymbol?    : string
  pointValue?      : number
  costPerOperation?: number
  marginValue?     : number
  increment?       : number
  currencyId?      : number
  currencyCode?    : string
  running?         : boolean
  activation?      : number
  active?          : boolean
  status?          : number
}

//=============================================================================
//===
//=== System adapter
//===
//=============================================================================

export class AdapterParam {
  name      : string  = ""
  type      : string  = ""
  defValue  : string  = ""
  nullable  : boolean = false
  minValue  : number  = 0
  maxValue  : number  = 0
  groupName : string  = ""
  valueStr  : string  = ""
  valueBool : boolean = false
  valueInt  : number  = 0
}

//=============================================================================

export class Adapter {
  code?                  : string
  name?                  : string
  params                 : AdapterParam[] = []
  supportsFeed?          : boolean
  supportsBroker?        : boolean
  supportsMultipleFeeds? : boolean
  supportsInventory?     : boolean
}

//=============================================================================

class BaseMonitoring {
  time         : Date  [] = [];
  grossProfit  : number[] = [];
  netProfit    : number[] = [];
  grossDrawdown: number[] = [];
  netDrawdown  : number[] = [];
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

export class TradingFilter {
  equAvgEnabled : boolean = false
  equAvgLen     : number  = 0

  posProEnabled : boolean = false
  posProLen     : number  = 0

  winPerEnabled : boolean = false
  winPerLen     : number  = 0
  winPerValue   : number  = 0

  oldNewEnabled : boolean = false
  oldNewOldLen  : number  = 0
  oldNewOldPerc : number  = 0
  oldNewNewLen  : number  = 0

  trendlineEnabled : boolean = false
  trendlineLen     : number  = 0
  trendlineValue   : number  = 0
}

//=============================================================================

export class FilterAnalysisRequest {
  filter? : TradingFilter

  constructor(filter? : TradingFilter) {
    this.filter = filter
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

export class Serie {
  time   : Date  [] = []
  values : number[] = []
}

//-----------------------------------------------------------------------------

export class Equities {
  time               : Date  [] = []
  unfilteredEquity   : number[] = []
  filteredEquity     : number[] = []
  unfilteredDrawdown : number[] = []
  filteredDrawdown   : number[] = []
  filterActivation   : number[] = []
  average            : Serie = new Serie()
}

//-----------------------------------------------------------------------------

export class Activations {
  equityVsAverage?   : Serie
  positiveProfit?    : Serie
  winningPercentage? : Serie
  oldVsNew?          : Serie
  trendline?         : Serie
}

//-----------------------------------------------------------------------------

export class FilterAnalysisResponse {
  tradingSystem : TradingSystemSmall = new TradingSystemSmall()
  summary       : Summary            = new Summary()
  equities      : Equities           = new Equities()
  filter        : TradingFilter      = new TradingFilter()
  activations   : Activations        = new Activations()
}

//-----------------------------------------------------------------------------

export class TradingSystemProperty {
  static RUNNING    = "running"
  static ACTIVATION = "activation"
  static ACTIVE     = "active"
}

export class TspResponseStatus {
  static OK      = "ok"
  static SKIPPED = "skipped"
  static ERROR   = "error"
}

export class TradingSystemPropertyResponse {
  status   : string = ""
  message? : string
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
  enableTrendline : boolean = true
  algorithm       : string = "simple"

  posProLen     : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  oldNewOldLen  : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  oldNewNewLen  : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  oldNewOldPerc : FieldOptimization = new FieldOptimization(true, 90, 5, 150, 5)
  winPercLen    : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  winPercPerc   : FieldOptimization = new FieldOptimization(true, 50, 5, 100, 5)
  equAvgLen     : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  trendlineLen  : FieldOptimization = new FieldOptimization(true, 20, 2, 160, 1)
  trendlineValue: FieldOptimization = new FieldOptimization(true, 10, 1, 100, 1)
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
  length      : number = 0
  newLength   : number = 0
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
  trendline? : boolean
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
  time       : string = ""
  open       : number = 0
  high       : number = 0
  low        : number = 0
  close      : number = 0
  upVolume   : number = 0
  downVolume : number = 0
}

//=============================================================================

export class DataInstrumentDataResponse {
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
//===
//=== General container for FlexTree
//===
//=============================================================================

export class TreeNode {
  id       : string
  name     : string
  children : TreeNode[] = []
  data     : any

  //---------------------------------------------------------------------------

  constructor(id:string, name:string, data? : any, children?:TreeNode[]) {
    if (children == undefined) {
      children = []
    }

    this.id       = id
    this.name     = name
    this.children = children
    this.data     = data
  }

  //---------------------------------------------------------------------------

  add(node : TreeNode) {
    this.children = [ ...this.children, node]
  }
}

//=============================================================================

export class SimpleTreeNodeProvider implements TreeNodeProvider<TreeNode> {
  getChildren(node: TreeNode): TreeNode[] {
    if (node.children !== undefined) {
      return node.children;
    }

    return [];
  }

  //---------------------------------------------------------------------------

  getName(node: TreeNode): string {
    if (node.name !== undefined) {
      return node.name;
    }

    return "";
  }
}

//=============================================================================
//===
//=== TradingSession
//===
//=============================================================================

export class CoreTime {
  hour : number = 0
  min  : number = 0
}

//=============================================================================

export class Pause {
  from? : CoreTime
  to?   : CoreTime
}

//=============================================================================

export class SessionDay  {
  day?   : number
  start? : CoreTime
  end?   : CoreTime
  pauses : Pause[] = []
}

//=============================================================================

export class SickSession {
  days : SessionDay[] = [];
}

//=============================================================================

export class TradingSession {
  id?        : number
  username?  : string
  name?      : string
  session?   : SickSession
  createdAt? : string
  updatedAt? : string
}

//=============================================================================
