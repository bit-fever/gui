//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export class CheckButtonConfig {
  offIcon : string = ""
  offLabel: string = ""
  offColor: string = ""

  onIcon  : string = ""
  onLabel : string = ""
  onColor : string = ""

  labelRoot : string = ""

  //-------------------------------------------------------------------------

  constructor(offIcon:string, offLabel:string, offColor:string, onIcon:string, onLabel:string, onColor:string, labelRoot:string) {
    this.offIcon  = offIcon
    this.offLabel = offLabel
    this.offColor = offColor
    this.onIcon   = onIcon
    this.onLabel  = onLabel
    this.onColor  = onColor
    this.labelRoot= labelRoot
  }
}

//=============================================================================
