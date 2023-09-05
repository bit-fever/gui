//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {importProvidersFrom}     from "@angular/core";
import {bootstrapApplication}    from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppComponent}            from "./app/layout/app.component";
import {provideRouter, Routes} from "@angular/router";
import {HomePanel} from "./app/layout/main-panel/work-panel/home/home.panel";
import {TradingSystemPanel} from "./app/layout/main-panel/work-panel/portfolio/trading-system/trading-system.panel";
import {ConfigurationPanel} from "./app/layout/main-panel/work-panel/admin/configuration/configuration.panel";
import {UnknownPanel} from "./app/layout/main-panel/work-panel/unknown/unknown.panel";
import {EventBusService} from "./app/service/eventbus.service";
import {HttpService} from "./app/service/http.service";
import {LabelService} from "./app/service/label.service";
import {ApplicationService} from "./app/service/application.service";
import {MenuService} from "./app/service/menu.service";
import {NotificationService} from "./app/service/notification.service";
import {SessionService} from "./app/service/session.service";
import {TradingSystemService} from "./app/service/trading-system.service";
import {HttpClientModule} from "@angular/common/http";
import {InstrumentService} from "./app/service/instrument.service";
import {MonitoringPanel} from "./app/layout/main-panel/work-panel/portfolio/monitoring/monitoring.panel";
import {PortfolioService} from "./app/service/portfolio.service";

//=============================================================================

const routes: Routes = [
	{ path:'',                          redirectTo:'home', pathMatch: 'full'       },

	{ path:'home',                      component: HomePanel                       },
	{ path:'portfolio/trading-system',  component: TradingSystemPanel              },
  { path:'portfolio/monitoring',      component: MonitoringPanel                 },
	{ path:'admin/config',              component: ConfigurationPanel              },
	// { path:'user-view',              component: UserViewPanel, outlet : 'right' },

	{ path:'**',                     component: UnknownPanel },
];

//=============================================================================

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(HttpClientModule),
		provideRouter(routes),

    ApplicationService,
    EventBusService,
    HttpService,
		InstrumentService,
    LabelService,
    MenuService,
    NotificationService,
    PortfolioService,
    SessionService,
    TradingSystemService
	]
})
.catch(err => console.error(err));

//=============================================================================
