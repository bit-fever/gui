//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

//=============================================================================
//===
//=== DataProductAnalysisResponse
//===
//=============================================================================

export class DataProductAnalysisResponse {
  id?          : number
  symbol?      : string
  from?        : number
  to?          : number
  days?        : number
  dailyResults : DailyResult[] = []
}

//=============================================================================

export class DailyResult {
  date?            : number
  price?           : number
  percDailyChange? : number
  sqn100?          : number
  trueRange?       : number
  percAtr20?       : number
  direction?       : number
  volatility?      : number
}

//=============================================================================
