//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class ChartOptions {
  showTotals       : boolean = true;
  showGrossProfit  : boolean = true;
  showNetProfit    : boolean = true;
  showGrossDrawdown: boolean = true;
  showNetDrawdown  : boolean = true;

  labelTotGrossProfit   : string = "";
  labelTotNetProfit     : string = "";
  labelTotGrossDrawdown : string = "";
  labelTotNetDrawdown   : string = "";
}

//=============================================================================
