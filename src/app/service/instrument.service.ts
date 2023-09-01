//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}     from "@angular/core";
import {HttpService}    from "./http.service";
import {Observable}     from "rxjs";
import {Instrument}     from "../model/model";
import {ListResponse}   from "../model/flex-table";

//=============================================================================

@Injectable()
export class InstrumentService {

	//---------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//---------------------------------------------------------------------------

	constructor(private httpService: HttpService) {}

	//---------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//---------------------------------------------------------------------------

	public getInstruments = (): Observable<ListResponse<Instrument>> => {
		return this.httpService.get<ListResponse<Instrument>>('/api/portfolio/v1/instruments');
	}
}

//=============================================================================
