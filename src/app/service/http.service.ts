//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}   from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

import {Observable, throwError}    from "rxjs";
import {catchError, finalize}      from "rxjs/operators";

import {AppEvent, ErrorEvent }     from "../model/event";
import {EventBusService}           from "./eventbus.service"

//=============================================================================

@Injectable()
export class HttpService {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	private openRequests : number = 0;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(private httpClient      : HttpClient,
                private eventBusService : EventBusService,
                private domSanitizer    : DomSanitizer ) {}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

	public get loading() : boolean {
		return (this.openRequests > 0);
	}

	//-------------------------------------------------------------------------

	public get = <T = any>(url : string, options? : any): Observable<T> => {

		this.showLoader();

		return this.httpClient.get<T>(url, options).pipe(
			catchError((err, caught) => this.handleError(err, caught)),
			finalize  (()      => this.hideLoader())
		);
	}

	//-------------------------------------------------------------------------

	public post = <T = any>(url: string, object: any, options?: any): Observable<T> => {

    this.showLoader();

    return this.httpClient.post<T>(url, object, options).pipe(
			catchError((error, caught) => this.handleError(error, caught)),
			finalize  (()      => this.hideLoader())
		);
	}

	//-------------------------------------------------------------------------

	public put = <T = any>(url: string, object: any, options?: any): Observable<T> => {

	  this.showLoader();

	  return this.httpClient.put<T>(url, object, options).pipe(
	    catchError((error, caught) => this.handleError(error, caught)),
	    finalize  (()      => this.hideLoader())
    );
	}

	//-------------------------------------------------------------------------

	public delete = <T = any>(url: string, options?: any): Observable<T> => {

	  this.showLoader();

	  return this.httpClient.delete<T>(url, options).pipe(
		  catchError((error, caught) => this.handleError(error, caught)),
		  finalize  (()      => this.hideLoader())
	  );
	}

	//-------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//-------------------------------------------------------------------------

	private handleError = (err: HttpErrorResponse, caught: Observable<any>) : Observable<any> => {

		console.log("HTTP error : " + JSON.stringify(err));
    console.log("Observable : " + JSON.stringify(caught));

		let reqError : ErrorEvent = {
      code : err.status.toString(),
      error: err.error.toString()
    };

		this.eventBusService.emitToError(reqError);

		return throwError(reqError);
	}

	//-------------------------------------------------------------------------

	private showLoader(): void {

		if (++this.openRequests == 1) {
			this.eventBusService.emitToApp(new AppEvent(AppEvent.SUBMIT_START));
		}
	}

	//-------------------------------------------------------------------------

	private hideLoader(): void {

		if (--this.openRequests == 0) {
			this.eventBusService.emitToApp(new AppEvent(AppEvent.SUBMIT_END));
		}
	}
}

//=============================================================================
