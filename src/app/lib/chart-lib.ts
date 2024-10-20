//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Serie} from "../model/model";

export class ChartLib {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public formatActivation(plot : Serie) : Serie {
    let res = new Serie();

    for (let i=0; i<plot.time.length; i++) {
      let day = plot.time[i]
      let val = plot.values[i]

      if (val != 0) {
        res.time   = [...res.time  , day]
        res.values = [...res.values, val]
      }
    }

    return res;
  }

  //-------------------------------------------------------------------------

  // public formatDay(day : number) : string {
  //   let sDay = String(day);
  //   return sDay.substring(0, 4) +"-"+ sDay.substring(4,6) +"-"+ sDay.substring(6,8)
  // }

  //-------------------------------------------------------------------------

  public buildDataset(name: string, times : any[], values : number[]) : any {
    let data : any[] = values.map( (e, i) => {
      return {
        x : times[i] ,
        y : e
      }
    })

    return {
      name: name,
      data: data
    }
  }
}

//=============================================================================
