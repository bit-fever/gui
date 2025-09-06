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

  public getProduct = (symbol:string, systemCode : string) : PresetProduct|undefined => {
    for (let p of this.products) {
      let pSymbol = p.symbol[systemCode]

      if (pSymbol == undefined) {
        pSymbol = p.symbol["default"]
      }

      if (symbol == pSymbol) {
        return p
      }
    }

    return undefined
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private loadProductsFile() {

    this.httpService.get<string>("assets/preset/"+ PresetsService.PRODUCTS_FILE, { responseType : "text" })
      .subscribe(result => {
        this.products = parse(result)
        this.products.forEach( p => {
          p.symbolDefault = p.symbol["default"]
        })

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
  symbol          : any
  symbolDefault?  : string
  name            : string  = ""
  increment       : number  = 0
  market          : string  = ""
  product         : string  = ""
  exchange        : string  = ""
  pointValue      : number  = 0
  costPerOperation: number  = 0
  margin          : number  = 0
  months          : string  = ""
  micro           : boolean = false
  rollover        : string  = "xxx"
}

//=============================================================================
