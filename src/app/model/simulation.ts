//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {PorTradingSystem} from "./model";
import {IntDateAdapter} from "../component/form/date-picker/int-date-adapter";
import {IntDateTranscoder} from "../component/panel/flex-table/transcoders";

//=============================================================================
//===
//=== QualityAnalysisRequest
//===
//=============================================================================

export class SimulationRequest {
  daysBack       : number = 0
  runs           : number = 10000
  width          : number = 0
  height         : number = 0
  initialCapital : number = 100000
  ruinPercentage : number = 25
}

//=============================================================================
//===
//=== QualityAnalysisResponse
//===
//=============================================================================

export class SimulationResult {
  status?         : string
  firstTradeDate? : number
  lastTradeDate?  : number
  runs?           : number
  initialCapital? : number
  ruinPercentage? : number
  risk?           : number
  startTime?      : Date
  endTime?        : Date
  step?           : number
  grossAll?       : Details
  grossLong?      : Details
  grossShort?     : Details
  netAll?         : Details
  netLong?        : Details
  netShort?       : Details
}

//=============================================================================

export class Details {
  equities      : string   = ""
  maxDrawdowns? : Distribution
}

//=============================================================================

export class Distribution {
  xAxis : string[] = []
  yAxis : number[] = []
}

//=============================================================================
