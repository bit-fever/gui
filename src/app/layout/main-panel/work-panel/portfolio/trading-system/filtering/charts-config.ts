//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexStroke, ApexTitleSubtitle, ApexXAxis} from "ng-apexcharts";
import {ChartOptions} from "../../../../../../lib/chart-lib";

//=============================================================================
//===
//=== Equity chart
//===
//=============================================================================

export function buildEquityChartOptions(title : string, clickFunction: any) : ChartOptions {
  return {
    chart: {
      type: "line",
      height: 500,
      id: "base",
      group: "equity",
      zoom: {
        enabled: true,
        allowMouseWheelZoom: false,
        autoScaleYaxis: true
      },
      events: {
        click: clickFunction,
      }
    },

    series: [],

    plotOptions: {},

    stroke: {
      curve: "stepline",
      width: 2,
      dashArray: [ 0, 0, 0, 0, 4]
    },

    dataLabels: {
      // enabled: true,
    },

    title: {
      text: title
    },

//    colors: [ '#008FFB', '#00E396', '#FF0000', '#800000' ],

    xaxis: {
      type: "datetime"
    },

    yaxis: {},

    colors: [],

    annotations: {
      xaxis: [ {} ]
    },
    grid: {},
    labels: []
  }
}

//=============================================================================
//===
//=== Activation chart
//===
//=============================================================================

export function buildActivationChartOptions(title : string) : ChartOptions {
  return <ChartOptions>{
    chart: <ApexChart>{
      type: "line",
      height: 300,
      id: "activ",
      group: "equity",
      zoom: {
        enabled: true,
        allowMouseWheelZoom: false
      }
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
