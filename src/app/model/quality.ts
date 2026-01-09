//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {PorTradingSystem} from "./model";

//=============================================================================
//===
//=== QualityAnalysisRequest
//===
//=============================================================================

export class QualityAnalysisRequest {
  daysBack : number = 0
}

//=============================================================================
//===
//=== QualityAnalysisResponse
//===
//=============================================================================

export class QualityAnalysisResponse {
  tradingSystem?    : PorTradingSystem
  qualityAllGross   : Metrics[][] = []
  qualityLongGross  : Metrics[][] = []
  qualityShortGross : Metrics[][] = []
  qualityAllNet     : Metrics[][] = []
  qualityLongNet    : Metrics[][] = []
  qualityShortNet   : Metrics[][] = []
}

//=============================================================================

export class Metrics {
  sqn?         : number
  sqn100?      : number
  trades       : number = 0
  tradesPerc?  : number
  maxDrawdown? : number
}

//=============================================================================
