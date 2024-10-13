//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

//=============================================================================
//===
//=== Bias analysis
//===
//=============================================================================

import {BrokerProduct, DataPoint} from "../../../../../model/model";

export class BiasAnalysis {
  id?               : number
  username?         : string
  dataInstrumentId? : number
  brokerProductId?  : number
  name?             : string
  notes?            : string
  createdAt?        : string
  updatedAt?        : string
}

//=============================================================================

export class BiasAnalysisFull extends BiasAnalysis {
  dataSymbol?   : string
  dataName?     : string
  brokerSymbol? : string
  brokerName?   : string
}

//=============================================================================

export class BiasConfig {
  id?         : number
  startDay?   : number
  startSlot?  : number
  endDay?     : number
  endSlot?    : number
  months?     : boolean[]
  excludes?   : string[]
  operation?  : number
  grossProfit?: number
  netProfit?  : number
}

//=============================================================================
//===
//=== BiasSummaryResponse
//===
//=============================================================================

export class BiasSummaryResponse {
  biasAnalysis  : BiasAnalysis = {}
  brokerProduct : BrokerProduct = {}
  result        : DataPointDowList[] = []
}

//=============================================================================

export class DataPointDowList {
  slots : DataPointSlotList[] = []
}

//=============================================================================

export class DataPointSlotList {
  list : DataPointEntry[] = []
}

//=============================================================================

export class DataPointEntry {
  year : number = 0
  month: number = 0
  day  : number = 0
  delta: number = 0
}

//=============================================================================
//===
//=== BiasBacktestRequest
//===
//=============================================================================

export class BiasBacktestRequest {
  stopLoss   : number = 0
  takeProfit : number = 0
  session    : string = ""
}

//=============================================================================
//===
//=== BiasBacktestResponse
//===
//=============================================================================

export class BiasBacktestResponse {
  biasAnalysis?    : BiasAnalysis
  brokerProduct?   : BrokerProduct
  backtestedConfigs: BacktestedConfig[] = []
}

//=============================================================================

export class BacktestedConfig {
  biasConfig?    : BiasConfig
  grossProfit?   : number
  netProfit?     : number
  grossAvgTrade? : number
  netAvgTrade?   : number
  biasTrades     : BiasTrade[] = []
  sequences      : TriggeringSequence[] = []
  equity?        : Equity
  profitDistrib? : ProfitDistribution
}

//=============================================================================

export class BiasTrade {
  entryTime   : string = ""
  entryValue  : number = 0
  exitTime    : string = ""
  exitValue   : number = 0
  operation   : number = 0
  grossProfit : number = 0
  netProfit   : number = 0
}

//=============================================================================

export class TriggeringSequence {
  dataPoints : DataPoint[] = []
}

//=============================================================================

export class Equity {
  time : Date  [] = []
  gross: number[] = []
  net  : number[] = []
}

//=============================================================================

export class ProfitDistribution {
  netProfits : number[] = []
  numTrades  : number[] = []
  avgTrades  : number[] = []
}

//=============================================================================
