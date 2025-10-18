//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class MinMax {
  minVal  : number  = 0
  maxVal  : number  = 0
  hasData : boolean = false

  //---------------------------------------------------------------------------

  constructor(list? : number[]) {
    if (list) {
      this.add(list)
    }
  }

  //---------------------------------------------------------------------------

  add(list : number[]) {
    list.forEach((val) => {
      this.update(val)
    })
  }

  //---------------------------------------------------------------------------

  update(value : number) {
    if ( ! this.hasData) {
      this.minVal = value
      this.maxVal = value
      this.hasData= true
    }
    else {
      this.minVal = Math.min(this.minVal, value)
      this.maxVal = Math.max(this.maxVal, value)
    }
  }
}

//=============================================================================
