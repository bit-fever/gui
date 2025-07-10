//=============================================================================
//===
//=== Copyright (C) 2025 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable} from "@angular/core";

//=============================================================================

@Injectable()
export class BroadcastService {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  private bc = new BroadcastChannel("bit-fever")

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public sendTradingSystemDeleted(id : number|undefined) {
    if (id != undefined) {
      this.bc.postMessage(new BroadcastEvent(EventType.TradingsSystem_Deleted, id))
      console.log("BroadcastService.sendTradingSystemDeleted: Sending delete event for TS with id="+id)
    }
  }

  //-------------------------------------------------------------------------

  public onEvent(f : BroadcastHandler) {
    this.bc.addEventListener("message", (e : MessageEvent) => {
      let be : BroadcastEvent = e.data
      f(be);
    })
  }
}

//=============================================================================

export enum EventType {
  TradingsSystem_Deleted = "TradingSystem_Deleted"
}

//-----------------------------------------------------------------------------

export class BroadcastEvent {
    type : EventType
    id   : any

    constructor(type:EventType, id:any) {
      this.type = type
      this.id   = id
    }
}

//=============================================================================

export type BroadcastHandler = (be : BroadcastEvent) => void;

//=============================================================================
