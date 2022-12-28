//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomePanel}              from "./layout/main-panel/work-panel/home/home.panel";
import {ConfigurationPanel}     from "./layout/main-panel/work-panel/admin/configuration/configuration.panel";
import {MarketInventoryPanel}   from "./layout/main-panel/work-panel/market/inventory/inventory.panel";
import {UnknownPanel}           from "./layout/main-panel/work-panel/unknown/unknown.panel";

//=============================================================================

const routes: Routes = [
  { path:'',                   redirectTo:'home', pathMatch: 'full'       },

  { path:'home',               component: HomePanel                       },
  { path:'markets/inventory',  component: MarketInventoryPanel          },
  { path:'admin/config',       component: ConfigurationPanel              },
  // { path:'user-view',              component: UserViewPanel, outlet : 'right' },

  { path:'**',                     component: UnknownPanel },
];

//=============================================================================

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

//=============================================================================

export class AppRoutingModule { }

//=============================================================================
