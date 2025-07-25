//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {enableProdMode, importProvidersFrom, provideZoneChangeDetection} from "@angular/core";
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
import {PresetsService} from "./app/service/presets.service";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {LocalService} from "./app/service/local.service";
import {StorageService} from "./app/service/storage.service";
import {ModuleService} from "./app/service/module.service";
import {BroadcastService} from "./app/service/broadcast.service";

//=============================================================================

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatNativeDateModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
    provideAuth(authConfig),
    ApplicationService,
    BroadcastService,
    EventBusService,
    HttpService,
    InventoryService,
    CollectorService,
    LabelService,
    MenuService,
    NotificationService,
    PortfolioService,
    ModuleService,
    PresetsService,
    SessionService,
    LocalService,
    StorageService,
    SystemAdapterService,
	]
})
.catch(err => console.error(err));

//=============================================================================
