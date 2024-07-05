//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {ChartConfiguration, ChartOptions} from "chart.js";
import {Chart} from "chart.js/auto";
import {Lib} from "../../../../../../../lib/lib";

//=============================================================================

export function createEquityChart(options : ChartOptions, result : any) : Chart {
  let config = Lib.chart.lineConfig("$")
  // let days = Lib.chart.formatDays(result.days);
  //
  // let datasets : any[] = [];
  //
  // if (options.showTotals) {
  //   datasets = [...datasets,
  //     Lib.chart.buildDataSet(options.labelTotRawProfit, days, result.rawProfit),
  //     Lib.chart.buildDataSet(options.labelTotNetProfit, days, result.netProfit),
  //   ]
  //
  //   let ds = Lib.chart.buildDataSet(options.labelTotRawDrawdown, days, result.rawDrawdown);
  //   ds.fill = {
  //     target: { value: 0 },
  //     below: "#E0808080"
  //   };
  //
  //   datasets = [...datasets, ds];
  //
  //   ds = Lib.chart.buildDataSet(options.labelTotNetDrawdown, days, result.netDrawdown);
  //   ds.fill = {
  //     target: { value: 0 },
  //     below: "#C0808080"
  //   };
  //
  //   datasets = [...datasets, ds];
  // }
  //
  // result.tradingSystems.forEach(function (tsm) {
  //   datasets = [...datasets, ...buildTSMDataSet(options, tsm)];
  // });
  //
  // config.data.datasets = datasets;
  // config.data.labels = Lib.chart.formatDays(result.days);

  return new Chart("dataChart", config);
}

//=============================================================================
//===
//=== Other functions
//===
//=============================================================================

// function buildTSMDataSet(options : ChartOptions, tsa : TradingSystemMonitoring) : any {
//
//   let res : any[]    = []
//   let days: string[] = Lib.chart.formatDays(tsa.days);
//
//   if (options.showRawProfit) {
//     res = [...res, Lib.chart.buildDataSet(tsa.name +" (Raw Profit)", days, tsa.rawProfit)];
//   }
//
//   if (options.showNetProfit) {
//     res = [...res, Lib.chart.buildDataSet(tsa.name +" (Net Profit)", days, tsa.netProfit)];
//   }
//
//   if (options.showRawDrawdown) {
//     let ds = Lib.chart.buildDataSet(tsa.name + " (Raw DD)", days, tsa.rawDrawdown);
//     ds.fill = {
//       target: { value: 0 },
//       below: "#FF808080"
//     };
//     res = [...res, ds];
//   }
//
//   if (options.showNetDrawdown) {
//     let ds = Lib.chart.buildDataSet(tsa.name + " (Net DD)", days, tsa.netDrawdown);
//     ds.fill = {
//       target: { value: 0 },
//       below: "#FF808080"
//     };
//     res = [...res, ds];
//   }
//
//   return res
// }

//=============================================================================
