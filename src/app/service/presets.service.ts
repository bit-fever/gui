//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

//=============================================================================

import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {EventBusService} from "./eventbus.service";
import {AppEvent} from "../model/event";
import {parse} from "yaml";

//=============================================================================

@Injectable()
export class PresetsService {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  public isLoaded : boolean = false;

  //-------------------------------------------------------------------------

  private static PRODUCTS_FILE : string = "products.yaml";

  private loadCounter : number;

  private products: PresetProduct[] = []

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private httpService : HttpService, private eventBusService: EventBusService) {

    this.loadCounter = 1;
    this.loadProductsFile();
  }

  //-------------------------------------------------------------------------
  //---
  //--- API methods
  //---
  //-------------------------------------------------------------------------

  public getProducts = () : PresetProduct[] => {
    return this.products
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private loadProductsFile() {

    this.httpService.get<string>("assets/presets/"+ PresetsService.PRODUCTS_FILE, { responseType : "text" })
      .subscribe(result => {
        this.products = parse(result)
        this.updateStatus()
      });
  }

  //-------------------------------------------------------------------------

  private updateStatus() {
    this.loadCounter--;

    if (this.loadCounter == 0) {
      console.log("All presets have been loaded.");
      this.isLoaded = true;
      this.eventBusService.emitToApp(new AppEvent(AppEvent.PRESETS_READY));
    }
  }
}

//=============================================================================

export class PresetProduct {
  symbol      : string = ""
  name        : string = ""
  increment   : number = 0
  market      : string = ""
  product     : string = ""
  exchange    : string = ""
  pointValue  : number = 0
  costPerTrade: number = 0
  margin      : number = 0
}

//=============================================================================
