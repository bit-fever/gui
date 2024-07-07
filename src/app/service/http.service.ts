//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType, HttpHeaderResponse,
  HttpHeaders,
  HttpProgressEvent,
  HttpResponse
} from "@angular/common/http";

import {Observable, throwError} from "rxjs";
import {catchError, finalize, map} from "rxjs/operators";

import {AppEvent, ErrorEvent} from "../model/event";
import {EventBusService} from "./eventbus.service"
import {SessionService} from "./session.service";

//=============================================================================

export class UploadEvent <T> {
  status    : number = 0
  percentage: number  = 0
  result    : T|null  = null
  error     : string = ''

  //-------------------------------------------------------------------------

  public setInProgress(percentage : number) : UploadEvent<T> {
    this.status     = 0
    this.percentage = percentage
    return this
  }

  //-------------------------------------------------------------------------

  public setCompleted(result : T|null) : UploadEvent<T> {
    this.status     = 1
    this.percentage = 100
    this.result     = result
    return this
  }

  //-------------------------------------------------------------------------

  public setInError(error: string) : UploadEvent<T> {
    this.status = 2
    this.error  = error
    return this
  }

  //-------------------------------------------------------------------------

  public setOther() : UploadEvent<T> {
    this.status = 3
    return this
  }

  //-------------------------------------------------------------------------

  public isInProgress() { return this.status == 0}
  public isCompleted () { return this.status == 1}
  public isInError   () { return this.status == 2}
  public isOther     () { return this.status == 3}
}

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
              private sessionService  : SessionService) {
  }

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

  public upload = <T = any>(url: string, data: any, files: any[]):Observable<UploadEvent<T>> => {
    let headers = new HttpHeaders() //.set('Content-Type', 'application/json');

    this.showLoader()

    let options = {
      headers,
      reportProgress: true,
      observe: 'events'
    }

    let formData = new FormData()
    formData.append('parameters', JSON.stringify(data))
    files.forEach((file, i) => {
      formData.append('file', file);
    });

    return this.httpClient.post<T>(url, formData, this.setupOptions(options)).pipe(
      map((event) => {
        console.log("HTTP event : "+ JSON.stringify(event))

        switch (event.type) {
          case HttpEventType.UploadProgress:
            return this.uploadInProgress(event)

          case HttpEventType.ResponseHeader:
            return this.uploadHeaders(event)

          case HttpEventType.Response:
            return this.uploadCompleted(event)

          default:
            return new UploadEvent<T>().setOther();
        }
      })
    )
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
      let headers = options['headers']

      if ( ! headers) {
        headers = new HttpHeaders()
      }

      options['headers'] = headers.set('Authorization', 'Bearer ' + this.sessionService.accessToken)
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

  //-------------------------------------------------------------------------

  private uploadInProgress<T>(event : HttpProgressEvent) : UploadEvent<T> {
    let progress = 100 * event.loaded

    if (event.total) {
      progress = Math.round(progress / event.total)
    }
    else {
      progress = 0
    }

    return new UploadEvent<T>().setInProgress(progress);
  }

  //-------------------------------------------------------------------------

  private uploadHeaders<T>(event: HttpHeaderResponse) : UploadEvent<T> {
    this.hideLoader()

    if (event.status == 200) {
      return new UploadEvent<T>().setOther();
    }

    console.log("Got an error in the headers: "+JSON.stringify(event))

    let error = event.statusText
    if (event.status == 404) {
      error = "Not found : "+ event.url
    }
    else if (event.status == 401) {
      error = "Not authorized : "+ event.url
    }
    else {
      error = "Error accessing : "+ event.url
    }

    let reqError : ErrorEvent = {
      code : event.status.toString(),
      error: error
    };

    this.eventBusService.emitToError(reqError);

    return new UploadEvent<T>().setInError(error)
  }

  //-------------------------------------------------------------------------

  private uploadCompleted<T>(event : HttpResponse<T>) : UploadEvent<T> {
    this.hideLoader()

    if (event.status == 200) {
      console.log("Response is good")
      return new UploadEvent<T>().setCompleted(event.body);
    }

    console.log("Got an error : "+JSON.stringify(event))

    let reqError : ErrorEvent = {
      code : event.status.toString(),
      error: event.statusText
    };

    this.eventBusService.emitToError(reqError);

    return new UploadEvent<T>().setInError(event.statusText)
  }
}

//=============================================================================
