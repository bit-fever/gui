//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {ApexAxisChartSeries, ApexChart, ApexXAxis, ChartComponent} from "ng-apexcharts";

//=============================================================================
//===
//=== Chart configs
//===
//=============================================================================

var categories= [
  "<64x", "-64x-32x", "-32x-16x", "-16x-8x", "-8x-4x", "-4x-2x",  "-2x-1x",  "-1x-0",
  "0-1x", "1x-2x",    "2x-4x",    "4x-8x",   "8x-16x", "16x-32x", "32x-64x", ">64x"
]

//=============================================================================
//=== Profits chart
//=============================================================================

export var profitChartOptions = {
  chart: <ApexChart>{
    type: "bar",
    height: 400,
    toolbar: {
      show: false
    },
  },
  series: <ApexAxisChartSeries>[],

  plotOptions: {
    bar: {
      colors: {
        ranges:[
          {
            from: -3000000,
            to: 0,
            color: '#E04040'
          },
          {
            from: 0,
            to: 3000000,
            color: '#40E040'
          }
        ]
      }
    }
  },

  dataLabels: {
    enabled: true,
    style: {
      colors: ['#e0e0e0']
    },
    background: {
      enabled: true,
      foreColor: '#000000'
    }
  },

  xaxis: <ApexXAxis>{
    categories: categories
  }
}

//=============================================================================
//=== Num trades chart
//=============================================================================

export var numTradesChartOptions = {
  chart: <ApexChart>{
    type: "bar",
    height: 300,
    toolbar: {
      show: false
    },
  },
  series: <ApexAxisChartSeries>[],

  plotOptions: {
    bar: {
    }
  },

  dataLabels: {
    enabled: true,
    style: {
      colors: ['#e0e0e0']
    },
    background: {
      enabled: true,
      foreColor: '#000000'
    }
  },

  xaxis: <ApexXAxis>{
    categories: categories
  }
}

//=============================================================================
//=== Avg trade chart
//=============================================================================

export var avgTradeChartOptions = {
  chart: <ApexChart>{
    type: "bar",
    height: 300,
    toolbar: {
      show: false
    },
  },
  series: <ApexAxisChartSeries>[],

  plotOptions: {
    bar: {
      colors: {
        ranges:[
          {
            from: -3000000,
            to: 0,
            color: '#E04040'
          },
          {
            from: 0,
            to: 3000000,
            color: '#40E040'
          }
        ]
      }
    }
  },

  dataLabels: {
    enabled: true,
    style: {
      colors: ['#e0e0e0']
    },
    background: {
      enabled: true,
      foreColor: '#000000'
    }
  },

  xaxis: <ApexXAxis>{
    categories: categories
  }
}

//=============================================================================
//=== Equity
//=============================================================================

export var equityChartOptions = {
  chart: <ApexChart>{
    type: "line",
    height: 500,
    // toolbar: {
    //   show: false
    // },
  },

  series: <ApexAxisChartSeries>[],

  plotOptions: {
  },

  dataLabels: {
    // enabled: true,
    // style: {
    //   colors: ['#e0e0e0']
    // },
    // background: {
    //   enabled: true,
    //   foreColor: '#000000'
    // }
  },

  xaxis: <ApexXAxis>{
    type: "datetime"
    // categories: categories
  }
}

//=============================================================================
