//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {EventEmitter, Injectable} from "@angular/core";

import {Subscription} from "rxjs";

import {AppEvent, ErrorEvent, ErrorHandler, EventHandler} from "../model/event";

//=============================================================================

@Injectable()
export class EventbusService {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	private eventEmitterMap : Map<string, EventEmitter<AppEvent>> = new Map();
	private errorEvents     : EventEmitter<ErrorEvent> = new EventEmitter();

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor() {
	}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	public subscribeToApp(eventCode : string, handler : EventHandler) : Subscription {

		let emitter : EventEmitter<AppEvent>|undefined = this.eventEmitterMap.get(eventCode);

		if (emitter == undefined) {
			emitter = new EventEmitter();
			this.eventEmitterMap.set(eventCode, emitter);
		}

		return emitter.subscribe(handler, null, null);
	}

	//-------------------------------------------------------------------------

	public emitToApp(event : AppEvent) : void {

		let emitter : EventEmitter<AppEvent>|undefined = this.eventEmitterMap.get(event.code);
    let emitted : boolean;

		if (emitter != undefined) {
			console.log("Emitting event: "+ JSON.stringify(event));
			emitter.emit(event);
      emitted = true;
		}
		else {
      emitted = false;
		}

		//--- Emitting to global handlers

		emitter = this.eventEmitterMap.get(AppEvent.ANY);

		if (emitter != undefined) {
			emitter.emit(event);
		}
    else if (!emitted) {
      console.log("WARNING: Trying to emit an event without any handler --> "+ JSON.stringify(event));
    }
	}

	//-------------------------------------------------------------------------

	public subscribeToError(handler : ErrorHandler) : Subscription {
		return this.errorEvents.subscribe(handler, null, null);
	}

	//-------------------------------------------------------------------------

	public emitToError(event : ErrorEvent) : void {
		console.log("Emitting error event: "+ JSON.stringify(event));
		this.errorEvents.emit(event);
	}
}

//=============================================================================
