//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================
//=============================================================================
//===
//=== Performance Analysis
//===
//=============================================================================

import {PorTradingSystem, Trade} from "./model";

export class PerformanceAnalysisRequest {
  daysBack  : number = 0
  timezone  : string = ""
  fromDate? : number
  toDate?   : number
}

//=============================================================================

export class PerformanceAnalysisResponse {
  general?       : General
  tradingSystem? : PorTradingSystem
  gross?         : Performance
  net?           : Performance
  allEquities?   : PerfEquities
  longEquities?  : PerfEquities
  shortEquities? : PerfEquities
  trades         : Trade[] = []
  aggregates?    : Aggregates
  distributions? : Distributions
  rolling?       : Rolling
}

//=============================================================================

export class General {
  fromDate               : number = 0
  toDate                 : number = 0
  sharpeRatioAnnualized? : number
  standardDevAnnualized? : number
  lowerTail?             : number
  upperTail?             : number
}

//=============================================================================

export class Performance {
  profit?        : Value;
  maxDrawdown?   : Value;
  averageTrade?  : Value;
  percentProfit? : Value;
}

//=============================================================================

export class Value {
  total : number = 0;
  long  : number = 0;
  short : number = 0;
}

//=============================================================================

export class PerfEquities {
  time         : Date[]   = [];
  grossProfit  : number[] = [];
  netProfit    : number[] = [];
  grossDrawdown: number[] = [];
  netDrawdown  : number[] = [];
  trades?      : number;
}

//=============================================================================

export class Aggregates {
  annual : AnnualAggregate[] = []
}

//=============================================================================

export class AnnualAggregate {
  year          : number = 0
  grossProfit   : number = 0
  grossAvgTrade : number = 0
  grossWinPerc  : number = 0
  netProfit     : number = 0
  netAvgTrade   : number = 0
  netWinPerc    : number = 0
  trades        : number = 0
}

//=============================================================================

export class Distributions {
  daily?             : Distribution
  tradesAllGross?    : Distribution
  tradesAllNet?      : Distribution
  tradesLongGross?   : Distribution
  tradesLongNet?     : Distribution
  tradesShortGross?  : Distribution
  tradesShortNet?    : Distribution
  annualSharpeRatio? : number
  annualStandardDev? : number
}

//=============================================================================

export class Distribution {
  mean?        : number
  median?      : number
  standardDev? : number
  sharpeRatio? : number
  lowerTail?   : number
  upperTail?   : number
  skewness?    : number
  histogram?   : Histogram
}

//=============================================================================

export class Histogram {
  bars    : number  [] = []
  ranges  : BarRange[] = []
  gaussian: number  [] = []
}

//=============================================================================

export class BarRange {
  minValue : number = 0
  maxValue : number = 0
}

//=============================================================================

export class Rolling {
  daily   : RollingInfo[] = []
  monthly : RollingInfo[] = []
  dayYoY  : YoYRolling[]  = []
  monthYoY: YoYRolling[]  = []
}

//=============================================================================

export class RollingInfo {
  trades       : Value = new Value()
  grossReturns : Value = new Value()
  netReturns   : Value = new Value()
}

//=============================================================================

export class YoYRolling {
  year   : number        = 0
  data   : RollingInfo[] = []
}

//=============================================================================
