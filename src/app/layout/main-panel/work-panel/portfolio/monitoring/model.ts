//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class ChartOptions {
  chartType      : string  = ChartType.Equities;
  showTotals     : boolean = true;
  showRawProfit  : boolean = true;
  showNetProfit  : boolean = true;
  showRawDrawdown: boolean = true;
  showNetDrawdown: boolean = true;

  labelTotRawProfit   : string = "";
  labelTotNetProfit   : string = "";
  labelTotRawDrawdown : string = "";
  labelTotNetDrawdown : string = "";
  labelTotTrades      : string = "";
}

//=============================================================================

export enum ChartType {
  Equities = "equities",
  Trades   = "trades"
}

//=============================================================================
