//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {enableProdMode, importProvidersFrom} from "@angular/core";
import {bootstrapApplication}    from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideRouter}           from "@angular/router";
import { provideAuth} from "angular-auth-oidc-client";

import {routes}                  from "./routes";
import {authConfig}              from "./authentication";

import {AppComponent}            from "./app/layout/app.component";
import {EventBusService}         from "./app/service/eventbus.service";
import {HttpService}             from "./app/service/http.service";
import {LabelService}            from "./app/service/label.service";
import {ApplicationService}      from "./app/service/application.service";
import {MenuService}             from "./app/service/menu.service";
import {NotificationService}     from "./app/service/notification.service";
import {SessionService}          from "./app/service/session.service";
import {environment}             from "./environments/environment";
import {SystemAdapterService} from "./app/service/system-adapter.service";
import {InventoryService} from "./app/service/inventory.service";
import {PortfolioService} from "./app/service/portfolio.service";
import {MatNativeDateModule} from "@angular/material/core";
import {CollectorService} from "./app/service/collector.service";

//=============================================================================

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatNativeDateModule),
    provideHttpClient(withInterceptorsFromDi()),
		provideRouter(routes),
    provideAuth(authConfig),
    ApplicationService,
    EventBusService,
    HttpService,
    InventoryService,
    CollectorService,
    LabelService,
    MenuService,
    NotificationService,
    PortfolioService,
    SessionService,
    SystemAdapterService,
	]
})
.catch(err => console.error(err));

//=============================================================================
