//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {ChartConfiguration} from "chart.js";
import {Plot} from "../model/model";

export class ChartLib {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public lineConfig(unit? : string) : ChartConfiguration {
    return {
      type: 'line',

      data: {
        labels: [],
        datasets: []
      },

      options: {
        elements: {
          point: {
            radius: 1
          },
          line: {
            borderWidth: 1
          }
        },
        aspectRatio:2,
        scales: {
          y: {
            ticks: {
              callback: value => unit ? `${value} `+unit : `${value}`
            }
          }
        }
      }
    }
  }

  //-------------------------------------------------------------------------

  public formatDays(days : number[]) : string[] {
    let res : string[] = [];

    for (let i=0; i<days.length; i++) {
      res = [...res, this.formatDay(days[i])]
    }

    return res;
  }

  //-------------------------------------------------------------------------

  public formatActivation(plot : Plot) : Plot {
    let res = new Plot();

    for (let i=0; i<plot.days.length; i++) {
      let day = plot.days[i]
      let val = plot.values[i]

      if (val != 0) {
        res.days   = [...res.days  , day]
        res.values = [...res.values, val]
      }
    }

    return res;
  }

  //-------------------------------------------------------------------------

  public formatDay(day : number) : string {
    let sDay = String(day);
    return sDay.substring(0, 4) +"-"+ sDay.substring(4,6) +"-"+ sDay.substring(6,8)
  }

  //-------------------------------------------------------------------------

  public buildDataSet(name : string, days : string[], serie : number[]) : any {

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
}

//=============================================================================
