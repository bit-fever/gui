//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {PortfolioMonitoringResponse, TradingSystemMonitoring} from "../../../../../model/model";
import {ChartConfiguration} from "chart.js";
import {Chart} from "chart.js/auto";
import {ChartOptions, ChartType} from "./model";

//=============================================================================

export function createChart(options : ChartOptions, result : PortfolioMonitoringResponse) : Chart {
  switch (options.chartType) {
    case ChartType.Equities:
      return createEquityChart(options, result);
    case ChartType.Trades:
      return createTradesChart(options, result);
  }

  throw new Error("Unknown chartType : "+ options.chartType)
}

//=============================================================================

export function createEquityChart(options : ChartOptions, result : PortfolioMonitoringResponse) : Chart {
  let config : ChartConfiguration = {
    type: 'line',

    data: {
      labels: [],
      datasets: []
    },

    options: {
      aspectRatio:2,
      scales: {
        y: {
          ticks: {
            callback: value => `${value} $`
          }
        }
      }
    }
  }

  let days: string[] = convertDaysArray(result.days);

  let datasets : any[] = [];

  if (options.showTotals) {
    datasets = [...datasets,
      buildDataSet(options.labelTotRawProfit, days, result.rawProfit),
      buildDataSet(options.labelTotNetProfit, days, result.netProfit),
    ]

    let ds = buildDataSet(options.labelTotRawDrawdown, days, result.rawDrawdown);
    ds.fill = {
      target: { value: 0 },
      below: "#E0808080"
    };

    datasets = [...datasets, ds];

    ds = buildDataSet(options.labelTotNetDrawdown, days, result.netDrawdown);
    ds.fill = {
      target: { value: 0 },
      below: "#C0808080"
    };

    datasets = [...datasets, ds];
  }

  result.tradingSystems.forEach(function (tsm) {
    datasets = [...datasets, ...buildTSMDataSet(options, tsm)];
  });

  config.data.datasets = datasets;
  config.data.labels = formatDays(result.days);

  return new Chart("equityChart", config);
}

//=============================================================================

export function createTradesChart(options : ChartOptions, result : PortfolioMonitoringResponse) : Chart {
  let config : ChartConfiguration = {
    type: 'line',

    data: {
      labels: [],
      datasets: []
    },

    options: {
      aspectRatio:2,
    }
  }

  let days: string[] = convertDaysArray(result.days);

  let datasets : any[] = [];

  if (options.showTotals) {
    let ds = buildDataSet(options.labelTotTrades, days, result.numTrades);
    datasets = [...datasets, ds];
  }

  result.tradingSystems.forEach(function (tsm) {
    let ds = buildDataSet(tsm.name, days, tsm.numTrades);
    datasets = [...datasets, ds];
  });

  config.data.datasets = datasets;
  config.data.labels = formatDays(result.days);

  return new Chart("equityChart", config);
}

//=============================================================================
//===
//=== Other functions
//===
//=============================================================================

function buildTSMDataSet(options : ChartOptions, tsa : TradingSystemMonitoring) : any {

  let res : any[]    = []
  let days: string[] = convertDaysArray(tsa.days);

  if (options.showRawProfit) {
    res = [...res, buildDataSet(tsa.name +" (Raw Profit)", days, tsa.rawProfit)];
  }

  if (options.showNetProfit) {
    res = [...res, buildDataSet(tsa.name +" (Net Profit)", days, tsa.netProfit)];
  }

  if (options.showRawDrawdown) {
    let ds = buildDataSet(tsa.name + " (Raw DD)", days, tsa.rawDrawdown);
    ds.fill = {
      target: { value: 0 },
      below: "#FF808080"
    };
    res = [...res, ds];
  }

  if (options.showNetDrawdown) {
    let ds = buildDataSet(tsa.name + " (Net DD)", days, tsa.netDrawdown);
    ds.fill = {
      target: { value: 0 },
      below: "#FF808080"
    };
    res = [...res, ds];
  }

  return res
}

//=============================================================================

function convertDaysArray(days : number[]) : string[] {
  let res : string[] = [];

  for (let i=0; i<days.length; i++) {
    res = [...res, formatDay(days[i])]
  }

  return res;
}

//=============================================================================

function buildDataSet(name : string, days : string[], serie : number[]) : any {

  let data : any[] = []

  for (let i=0; i<days.length; i++) {
    let elem = {
      x: days[i],
      y: serie[i]
    }
    data = [...data, elem]
  }

  return {
    label: name,
    data: data
  }
}

//=============================================================================

function formatDays(data : number[]) : string[] {
  let res : string[] = [];

  for (let i=0; i<data.length; i++) {
    let rawDay = String(data[i]);
    let forDay = rawDay.substring(0, 4) +"-"+ rawDay.substring(4,6) +"-"+ rawDay.substring(6,8)

    res = [...res, forDay]
  }

  return res;
}

//=============================================================================

function formatDay(day : number) : string {
  let sDay = String(day);
  return sDay.substring(0, 4) +"-"+ sDay.substring(4,6) +"-"+ sDay.substring(6,8)
}

//=============================================================================
