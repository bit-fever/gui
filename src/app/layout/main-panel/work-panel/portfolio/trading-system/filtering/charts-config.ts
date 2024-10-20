//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexXAxis} from "ng-apexcharts";

//=============================================================================
//===
//=== Equity chart
//===
//=============================================================================

export function buildEquityChartOptions(title : string) : {} {
  return {
    chart: <ApexChart>{
      type: "line",
      height: 500,
      id: "base",
      group: "equity",
    },

    series: <ApexAxisChartSeries>[],

    plotOptions: {},

    stroke: <ApexStroke>{
      curve: "stepline",
      width: 2,
      dashArray: [ 0, 0, 0, 0, 4]
    },

    dataLabels: {
      // enabled: true,
    },

    title: <ApexTitleSubtitle>{
      text: title
    },

//    colors: [ '#008FFB', '#00E396', '#FF0000', '#800000' ],

    xaxis: <ApexXAxis>{
      type: "datetime"
    }
  }
}

//=============================================================================
//===
//=== Activation chart
//===
//=============================================================================

export function buildActivationChartOptions(title : string) : {} {
  return {
    chart: <ApexChart>{
      type: "line",
      height: 300,
      id: "activ",
      group: "equity",
    },

    series: <ApexAxisChartSeries>[],

    plotOptions: {},

    stroke: <ApexStroke>{
      curve: "stepline",
      width: 2
    },

    dataLabels: {
      // enabled: true,
    },

    title: <ApexTitleSubtitle>{
      text: title
    },

    xaxis: <ApexXAxis>{
      type: "datetime"
    }
  }
}

//=============================================================================
