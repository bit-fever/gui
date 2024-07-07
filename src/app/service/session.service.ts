//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Injectable} from '@angular/core';

import {AppEvent}           from "../model/event";
import {AbstractSubscriber} from "./abstract-subscriber";
import {EventBusService}    from "./eventbus.service";
import {HttpService}        from "./http.service";
import {EventTypes, OidcSecurityService, PublicEventsService, UserDataResult} from "angular-auth-oidc-client";
import {Observable} from "rxjs";
import {filter} from "rxjs/operators";

//=============================================================================

@Injectable()
export class SessionService extends AbstractSubscriber {

	//-------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//-------------------------------------------------------------------------

	// public session     : Session;
	// public permissions : Map<string, boolean>;
  isAuthenticated = false;
  accessToken : string|null = null;
  userData    : UserDataResult|null = null;

	//-------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//-------------------------------------------------------------------------

	constructor(eventBusService: EventBusService,
              private oidcSecurityService: OidcSecurityService,
              private publicEventService : PublicEventsService) {
		super(eventBusService);

    publicEventService.registerForEvents()
      .pipe(filter( (notification) => notification.type === EventTypes.NewAuthenticationResult))
      .subscribe( (value) => {
        oidcSecurityService.getAccessToken().subscribe( (token) => {
          this.accessToken = token
        })
      })
	}

	//-------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//-------------------------------------------------------------------------

  public checkAuthentication() {
    console.log("Checking authentication...")

    this.oidcSecurityService.checkAuth().subscribe((res) => {
      this.isAuthenticated = res.isAuthenticated;
      this.userData        = res.userData;
      this.accessToken     = res.accessToken;

      console.log('Authenticated : '+ this.isAuthenticated);

      if ( ! this.isAuthenticated) {
        console.log("User not authenticated.");
        this.login();
      }
    });
  }

  //-------------------------------------------------------------------------

  login() {
    console.log('Calling login...');
    this.oidcSecurityService.authorize();
  }

  //-------------------------------------------------------------------------

  logout() {
    console.log('Calling logout...');
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => {
      console.log(result)
      this.isAuthenticated = false;
      this.userData        = null;
      this.accessToken     = null;
    });
  }

  //-------------------------------------------------------------------------

	// public clearSession() : void {
  //
	// 	console.log("SessionService.clearSession: Resetting session...");
  //
	// 	this.session     = null;
	// 	this.user        = null;
	// 	this.profile     = null;
	// 	this.permissions = new Map();
	// }

	//-------------------------------------------------------------------------

	// public get homePage() : string {
  //
	// 	return (this.profile)
	// 				? this.profile.homePage
	// 				: null;
	// }

	//-------------------------------------------------------------------------

	// public hasPermission(name : string) : boolean | undefined {
	// 	return this.permissions.get(name);
	// }

	//-------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//-------------------------------------------------------------------------

	// private loginSuccess(session: Session): void {
  //
	// 	this.session     = session;
	// 	this.user        = session.user;
	// 	this.profile     = session.profile;
	// 	this.permissions = this.setupPermissionMap(this.profile.permissions);
  //
	// 	super.emitToApp(new AppEvent(AppEvent.LOGIN_SUCCESS, session));
  //
	// 	console.log("Login successful for user="+ this.user.username);
	// }

	//-------------------------------------------------------------------------

	// private logoutSuccess(): void {
  //
	// 	let username = this.user.username;
  //
	// 	this.clearSession();
	// 	super.emitToApp(new AppEvent(AppEvent.LOGOUT_SUCCESS, username));
  //
	// 	console.log("Logout successful for user="+ username);
	// }

	//-------------------------------------------------------------------------

	// private logoutError(response: any): void {
  //
	// 	this.clearSession();
	// 	super.emitToApp(new AppEvent(AppEvent.LOGOUT_FAILED));
	// }

	//-------------------------------------------------------------------------

	private setupPermissionMap(permissions : string[]) : Map<string, boolean> {

		let map = new Map<string, boolean>();

		permissions.forEach((p : string) => map.set(p, true));

		return map;
	}

	//-------------------------------------------------------------------------
	//---
	//--- Events
	//---
	//-------------------------------------------------------------------------

	// private onInvalidToken(event : AppEvent) {
	// 	this.clearSession();
	// }
}

//=============================================================================
