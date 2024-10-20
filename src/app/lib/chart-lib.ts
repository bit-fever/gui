//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class ChartLib {

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public buildDataset(name: string, times : any[], values : number[], isDrawdown? : boolean) : any {
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
      color: "",
    }

    if (isDrawdown) {
      res.type = "area"
      res.color= "#FF565A"
    }

    return res
  }
}

//=============================================================================
