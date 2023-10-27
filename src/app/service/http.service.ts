//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable}   from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

import {Observable, throwError}    from "rxjs";
import {catchError, finalize}      from "rxjs/operators";

import {AppEvent, ErrorEvent }     from "../model/event";
import {EventBusService}           from "./eventbus.service"
import {SessionService} from "./session.service";

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
              private sessionService  : SessionService) {}

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

		return this.httpClient.get<T>(url, this.setupOptions(options)).pipe(
			catchError((err, caught) => this.handleError(err, caught)),
			finalize  (()      => this.hideLoader())
		);
	}

	//-------------------------------------------------------------------------

	public post = <T = any>(url: string, object: any, options?: any): Observable<T> => {

    this.showLoader();

    return this.httpClient.post<T>(url, object, this.setupOptions(options)).pipe(
			catchError((error, caught) => this.handleError(error, caught)),
			finalize  (()      => this.hideLoader())
		);
	}

	//-------------------------------------------------------------------------

	public put = <T = any>(url: string, object: any, options?: any): Observable<T> => {

	  this.showLoader();

	  return this.httpClient.put<T>(url, object, this.setupOptions(options)).pipe(
	    catchError((error, caught) => this.handleError(error, caught)),
	    finalize  (()      => this.hideLoader())
    );
	}

	//-------------------------------------------------------------------------

	public delete = <T = any>(url: string, options?: any): Observable<T> => {

	  this.showLoader();

	  return this.httpClient.delete<T>(url, this.setupOptions(options)).pipe(
		  catchError((error, caught) => this.handleError(error, caught)),
		  finalize  (()      => this.hideLoader())
	  );
	}

	//-------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//-------------------------------------------------------------------------

  private setupOptions(options : any) : any {
    if ( ! this.sessionService.isAuthenticated) {
      return options;
    }

    if (options == null) {
      options = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + this.sessionService.accessToken,
        }),
      }
    }
    else {
      options['headers'] = new HttpHeaders({
        Authorization: 'Bearer ' + this.sessionService.accessToken,
      })
    }

    return options;
  }

  //-------------------------------------------------------------------------

	private handleError = (err: HttpErrorResponse, caught: Observable<any>) : Observable<any> => {

		console.log("HTTP error : " + JSON.stringify(err));
    console.log("Observable : " + JSON.stringify(caught));

		let reqError : ErrorEvent = {
      code : err.status.toString(),
      error: err.error.error.toString()
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
