//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke, ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis
} from "ng-apexcharts";

//=============================================================================

export type ChartOptions = {
  title       : ApexTitleSubtitle
  series      : ApexAxisChartSeries
  chart       : ApexChart
  xaxis       : ApexXAxis
  yaxis       : ApexYAxis
  plotOptions : ApexPlotOptions
  dataLabels  : ApexDataLabels
  stroke      : ApexStroke
  colors      : string[]
  annotations : ApexAnnotations
  grid        : ApexGrid
};

//=============================================================================

export class ChartLib {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public buildDataset(name: string, times : any[], values : number[], isDrawdown? : boolean, color? : string) : any {
    let data : any[] = values.map( (e, i) => {
      return {
        x : times[i] ,
        y : e
      }
    })

    let res = {
      name: name,
      data: data,
      type: "line",
      color: color,
    }

    if (isDrawdown) {
      res.type = "area"
      res.color= "#FF565A"
    }

    return res
  }
}

//=============================================================================
